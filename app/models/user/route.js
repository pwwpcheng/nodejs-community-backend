const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('./controller')
const userValidator = require('./validator')

router.post('/', [userValidator.validateUserCreate()], userController.create)
router.get('/:username', [passport.authenticationMiddleware()], userController.get)
router.put('/:username', [passport.authenticationMiddleware(), 
                          userValidator.validateUserUpdate()],
                          userController.update)
router.delete('/:username', [passport.authenticationMiddleware()], userController.delete)

module.exports = router

