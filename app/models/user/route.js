const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('./controller')
const userValidator = require('./validator')
const acl = require('../../middlewares/acl/')

//router.get('/isFriend', [], userController.isFriendCheck)
router.post('/', [userValidator.validateUserCreate()], userController.create)
//router.get('/:username', [passport.authenticationMiddleware(), 
//                          acl.aclMiddleware()], 
//                          userController.get)
router.get('/:username', userController.get)
router.put('/:username', [passport.authenticationMiddleware(), 
                          userValidator.validateUserUpdate()],
                          userController.update)
router.delete('/:username', [passport.authenticationMiddleware()], userController.delete)

module.exports = router

