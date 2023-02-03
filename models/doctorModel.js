const mongoose = require('mongoose')
const doctorSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    feePerConcultation: {
        type: Number,
        required: true,
    },
    timings: {
        type: Array,
        requied: true,
    },
    status: {
        type: String,
        Default: 'pending',
    }

})

const doctorModel = mongoose.model('doctors', doctorSchema)
module.exports = doctorModel