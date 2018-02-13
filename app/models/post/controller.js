const async = require('async')
const mongoose = require('mongoose')
const Post = require('./model').Post
const postHelper = require('./helper')
const mediaHelper = require('../media/helper')
const userHelper = require('../user/helper')
function createPost(req, res, next) {
  var postData = req.body
  postData['userId'] = req.user._id
  postData['createdAt'] = Date.now()
  
  var cb = function(err, data){
    if(err) {
      next(err)
    } else {
      return res.status(204).send()
    }
  }
  
  return postHelper.createPost(postData, cb)
}

// TODO(cheng):    
// This function needs clean up since its acl functionality
// has been isolated to acl module.
function getPost(req, res, next) {
  var getPost = function(callback) {
    var cb = function(err, res) {
      if(err) { return callback(err) }
      return callback(null, res.getPublicFields())
    }
    return postHelper.getPostById(req.params.postId)(cb)
  }

  var appendPostMedia = function(post, callback) {
    async.each(post.media, function(mediaId, cb) {
      return mediaHelper.getMedia({_id: mediaId}, cb)
    }, function(err, res){
      if (err) { return callback(err) }
      post.media = res
      return callback(null, post)
    })
  }

  var appendUsername = function(post, callback) {
    var userId = post.userId
    var cb = function(err, res) {
      if(err) { return callback(err) } 
      post.username = res.username
      return callback(null, post)
    }
    return userHelper.getUserById(userId)(cb)
  }

  async.waterfall([
    getPost,
    appendPostMedia,
    appendUsername,
  ], function(err, post){
    if(err) { return next(err) }
    return res.json(post)
  })
}

// Currently, we do not delete media when its related post
// is deleted. Media removal should be done seperately or
// manually.
function deletePost(req, res, next) {
  async.series([
    postHelper.getPostById(req.params.postId),
    postHelper.deletePostById(req.params.postId)
  ], function(err, post) {
    if(err) {
      next(err)
    } else {
      return res.status(204).send()
    }
  })
}  

module.exports = {
  create: createPost,
  get: getPost,
  delete: deletePost
}
