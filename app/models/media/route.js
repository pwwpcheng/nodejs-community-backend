const express = require('express')
const router = express.Router()
const passport = require('passport')
const mediaController = require('./controller')
const mediaValidator = require('./validator')

router.use(passport.authenticationMiddleware())

router.get('/upload/createRequest', mediaController.getUploadRequest)
router.post('/upload/setValid', [mediaValidator.setValid], mediaController.setValid)
router.get('/:mediaId', [mediaValidator.get],  mediaController.get)

module.exports = router

