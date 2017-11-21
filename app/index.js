const express = require('express')
const session = require('express-session')
const passport = require('passport')
const mongoConn = require('./conn/mongo_conn')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')

// Initialize app with express
var app = express()
app.use(cookieParser())

// Initialize and use body-parser
app.use(bodyParser.urlencoded({ limit: '428800', extended: true }))
app.use(bodyParser.json({limit: '428800'}))

// Initialize middleware
app.use(session({secret: "something"}))

//  - Initialize authentication middleware with passport
require('./auth').init(app)
app.use(passport.initialize())
app.use(passport.session())

// Set routes for passport
app.use('/api', require('./route/routes'))

module.exports = app;
