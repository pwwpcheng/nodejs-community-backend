const express = require('express')
const router = express.Router()
const passport = require('passport')
const postController = require('./controller')
//const postValidator = require('./validator')

//router.post('/', [postValidator.validatePostCreate()], postController.create)
router.post('/', [passport.authenticationMiddleware()], postController.create)
//router.post('/', postController.create)
router.get('/:postId', [passport.authenticationMiddleware()], postController.get)

module.exports = router
