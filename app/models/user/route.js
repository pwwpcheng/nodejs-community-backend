const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('./controller')

router.post('/', userController.create)
router.get('/:username', userController.get)
//router.put('/:userId', userController.update)
router.delete('/:userId', userController.delete)
//router.get('/logout', authController.logout);

module.exports = router

