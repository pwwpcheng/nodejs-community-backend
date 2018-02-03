const express = require('express')
const router = express.Router()
const passport = require('passport')
const mediaController = require('./controller')

//router.post('/', [userValidator.validateUserCreate()], userController.create)
//router.get('/:mediaId', [passport.authenticationMiddleware()], mediaController.get)
router.get('/upload/createRequest', mediaController.getUploadRequest)
router.post('/upload/setValid', mediaController.setValid)
router.get('/:mediaId', mediaController.get)

//router.put('/:username', [passport.authenticationMiddleware(), 
//                          userValidator.validateUserUpdate()],
//                          userController.update)
//router.delete('/:username', [passport.authenticationMiddleware()], userController.delete)

module.exports = router

