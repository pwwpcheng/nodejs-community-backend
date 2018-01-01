const express = require('express')
const router = express.Router()
const passport = require('passport')
const groupController = require('./controller')
const groupValidator = require('./validator')
const groupAcl = require('./acl')

router.use(passport.authenticationMiddleware())

//router.post('/', [groupValidator.validateUserCreate()], groupController.create)
router.get('/:groupname', [acl.aclMiddleware()],
                          groupController.get)
//router.put('/:groupname', [groupValidator.validateUserUpdate()],
//                          groupController.update)
router.delete('/:groupname',groupController.delete)

module.exports = router
