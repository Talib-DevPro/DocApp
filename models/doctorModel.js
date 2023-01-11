const mongoose = require('mongoose')
const doctorSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    }
})