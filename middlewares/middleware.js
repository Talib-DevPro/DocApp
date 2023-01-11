const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).send({ message: 'Auth failed', success: false })
            } else {
                req.body.userId = decoded.id
                next()
            }
        })
    } catch (error) {
        res.status(401).send({ message: 'Auth faild', success: false })
    }

}