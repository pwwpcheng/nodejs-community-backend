const express = require('express')
const router = express.Router()

const AuthRouter = require('../auth/route')
const UserRouter = require('../model/user/route')

router.use('/auth', AuthRouter)
router.use('/user', UserRouter)

module.exports = router
