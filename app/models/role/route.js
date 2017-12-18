const express = require('express')
const router = express.Router()
const passport = require('passport')
const roleController = require('./controller')
const roleValidator = require('./validator')

//router.post('/', [roleValidator.validateRoleCreate()], roleController.create)
//router.get('/:name', [passport.authenticationMiddleware()], roleController.get)
router.put('/:name', [passport.authenticationMiddleware(), 
                          roleValidator.validateRoleUpdate()],
                          roleController.update)
router.delete('/:name', [passport.authenticationMiddleware()], roleController.delete)

module.exports = router

