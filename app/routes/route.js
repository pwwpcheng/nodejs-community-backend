const express = require('express')
const router = express.Router()

const AuthRouter = require('../middlewares/auth/route')
const UserRouter = require('../models/user/route')
const PostRouter = require('../models/post/route')
const MediaRouter = require('../models/media/route')

router.use('/auth', AuthRouter)
router.use('/user', UserRouter)
router.use('/post', PostRouter)
router.use('/media', MediaRouter)

module.exports = router
