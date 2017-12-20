const express = require('express')
const router = express.Router()

const AuthRouter = require('../middlewares/auth/route')
const UserRouter = require('../models/user/route')
const PostRouter = require('../models/post/route')
const MediaRouter = require('../models/media/route')
const RoleRouter = require('../models/role/route')

router.use('/auth', AuthRouter)
router.use('/user', UserRouter)
router.use('/post', PostRouter)
router.use('/media', MediaRouter)
router.use('/role', RoleRouter)

module.exports = router
