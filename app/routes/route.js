const express = require('express')
const router = express.Router()

const AuthRouter = require('../middlewares/auth/route')
const UserRouter = require('../models/user/route')

router.use('/auth', AuthRouter)
router.use('/user', UserRouter)

module.exports = router
