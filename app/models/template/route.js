const express = require('express')
const router = express.Router()
const passport = require('passport')
const templateController = require('./controller')
const templateValidator = require('./validator')
const templateAcl = require('./acl')

router.post('/', [templateValidator.validateTemplateCreate(),], templateController.create)
router.get('/:templatename', [passport.authenticationMiddleware(),
                          acl.aclMiddleware()],
                          templateController.get)
router.put('/:templatename', [passport.authenticationMiddleware(),
                          templateValidator.validateTemplateUpdate()],
                          templateController.update)
router.delete('/:templatename', [passport.authenticationMiddleware()], templateController.delete)

module.exports = router
