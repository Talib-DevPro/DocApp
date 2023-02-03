const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const Doctor = require('../models/doctorModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const middleware = require('../middlewares/middleware')

router.post('/register', async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email })
        if (userExist) {
            return res.status(200).send({ message: 'User already exists', success: false })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt)
        req.body.password = hashpassword
        const newUser = new User(req.body)
        await newUser.save()
        res.status(200).send({ message: 'User created successfully', success: true })

    } catch (error) {
        res.status(500).send({ message: 'something went wrong', success: false, error })
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res
                .status(200)
                .send({ message: 'User does not exist', success: false })
        }
        const ismatch = await bcrypt.compare(req.body.password, user.password)
        if (!ismatch) {
            res
                .status(200)
                .send({ message: 'Password is not correct', success: false })
        } else {
            const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: process.env.EXPIRE_TIME
            })
            res
                .status(200)
                .send({ message: 'Login successfully', success: true, data: token })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'error logging in', success: false, error })

    }
})

router.post('/getUserById', middleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            res.status(200).send({ message: 'User not found', success: false })
        } else {
            res.status(200).send({
                success: true, data: user
            })
        }
    } catch (error) {
        res.status(500).send({ message: 'Auth failed', success: false });
    }
})

router.post('/apply-doctor-account', middleware, async (req, res) => {
    try {
        const newDoctor = new Doctor({ ...req.body, status: 'pending' })
        await Doctor.save()

        const adminUser = await User.findOne({ isAdmin: true })

        const unseenNotifications = newDoctor.unseenNotifications
        unseenNotifications.push({
            type: 'new-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName
            },
            onClickPath: '/admin/doctors'

        })
        await User.findOneAndUpdate(adminUser._id, { unseenNotifications })
        res.status(200).send({ message: 'User created successfully', success: true })

    } catch (error) {
        res.status(500).send({ message: 'something went wrong', success: false, error })
    }
})

module.exports = router

