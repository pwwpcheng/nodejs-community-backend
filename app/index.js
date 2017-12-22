const express = require('express')
const session = require('express-session')
const passport = require('passport')
const mongoConn = require('./connections/mongo_conn')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const validator = require('express-validator');

// Initialize app with express
var app = express()
app.use(cookieParser())

// Initialize and use body-parser
app.use(bodyParser.urlencoded({ limit: '428800', extended: true }))
app.use(bodyParser.json({limit: '428800'}))

// Initialize validator.
// Express-validator must be initialized after bodyParser
app.use(validator());

// Initialize middleware
app.use(session({secret: "something"}))

// - Initialize authentication middleware with passport
require('./middlewares/auth').init(app)
app.use(passport.initialize())
app.use(passport.session())

// Setup AccessControlList with acl middleware
const acl = require('./middlewares/acl')
app.use(acl.initialize())

// Set routes for application
app.use('/api', require('./routes/route'))

// - Initialize error handler
//   Error handler must be the last imported middleware.
const errorHandlerMiddleware = require('./middlewares/error_handler').middleware
app.use(errorHandlerMiddleware)

module.exports = app;
