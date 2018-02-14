const express = require('express')
const router = express.Router()
const passport = require('passport')
const acl = require('./acl')
const postController = require('./controller')
const postValidator = require('./validator')

router.use(passport.authenticationMiddleware())

router.post('/', [postValidator.create], postController.create)
router.get('/:postId', [//passport.authenticationMiddleware(),
                        //acl.get()
                        ], 
                        postController.get)
router.delete('/:postId', [passport.authenticationMiddleware()], postController.delete)

module.exports = router
