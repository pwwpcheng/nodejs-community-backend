const async = require('async')
const mongoose = require('mongoose')
const Post = require('./model').Post
const PostHelper = require('./helper')
const MediaHelper = require('../media/helper')

// This function is not completed.
function makeSelector(req) {
  return function(callback) {
    if(req.param) {}
  }
}

function createPost(req, res, next) {
  var create =   async.waterfall([
    PostHelper.makePostContent(req.body),
    PostHelper.makePost(req.body, req.user),
    PostHelper.createPost()
  ], function(err, data){
    if(err) {
      next(err)
    } else {
      return res.status(204).send()
    }
  })
}

// TODO(cheng):    
// This function needs clean up since its acl functionality
// has been isolated to acl module.
function getPost(req, res, next) {
  var appendPostMedia = function(post, callback) {
    async.each(post.media, function(mediaId, cb) {
      return MediaHelper.getMedia({_id: mediaId}, cb)
    }, function(err, res){
      if (err) { return callback(err) }
      post.media = res
      return callback(post)
    })
    return callback()
  }

  async.waterfall([
    PostHelper.getPostById(req.params.postId),
    appendPostMedia,
  ], function(err, post){
    if(err) { return next(err) }
    return res.json(post.getPublicFields())
  })
}

// Currently, we do not delete media when its related post
// is deleted. Media removal should be done seperately or
// manually.
function deletePost(req, res, next) {
  async.waterfall([
    PostHelper.getPost(req.params.postId),
    PostHelper.deletePost(req.params.postId)
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
