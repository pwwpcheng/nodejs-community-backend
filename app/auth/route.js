const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('./controller')

router.post('/login', authController.authenticate)
router.get('/logout', authController.logout)
router.get('/test', passport.authenticationMiddleware(), authController.test)
module.exports = router

