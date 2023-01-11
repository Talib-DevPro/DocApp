const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL)
const connection = mongoose.connection

connection.on('connected', () => { console.log(`Mongoose connection successful`) })

connection.on('error', (error) => { console.log(`error in mongoose connection ${error}`) })

module.exports = mongoose
