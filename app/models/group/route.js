const express = require('express')
const router = express.Router()
const passport = require('passport')
const groupController = require('./controller')
const groupValidator = require('./validator')
const acl = require('./acl')

router.use(passport.authenticationMiddleware())

//router.post('/', [groupValidator.validateUserCreate()], groupController.create)
router.get('/:groupname', groupController.get)
//router.put('/:groupname', [groupValidator.validateUserUpdate()],
//                          groupController.update)
router.delete('/:groupname',groupController.delete)
router.post('/:groupname/join', groupController.joinGroup)
router.post('/:groupname/leave', groupController.leaveGroup)

module.exports = router
