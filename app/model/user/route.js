var express = require('express')
var router = express.Router()
const passport = require('passport')
const userController = require('./controller')

router.post('/', userController.create)
//router.get('/logout', authController.logout);

module.exports = router

