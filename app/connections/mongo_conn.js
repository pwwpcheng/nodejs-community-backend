const mongoose = require('mongoose')
const config = require('../config/mongodb')

function dbConnSuccessCallback() {
    console.log("Connection with mongodb succeeded")
}

mongoose.connect(config.mongo_db)

const dbConn = mongoose.connection
dbConn.on('error', console.error.bind(console, 'connection error'))
dbConn.once('open', dbConnSuccessCallback)

exports.db = dbConn
