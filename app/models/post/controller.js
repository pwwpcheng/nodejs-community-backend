const async = require('async')
const mongoose = require('mongoose')
const Post = require('./model').Post
const postHelper = require('./helper')

// This function is not completed.
function makeSelector(req) {
  return function(callback) {
    if(req.param) {}
  }
}

function createPost(req, res, next) {
  var create =   async.waterfall([
    postHelper.makePostContent(req.body),
    postHelper.makePost(req.body, req.user),
    postHelper.createPost()
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
  async.waterfall([
    postHelper.getPost(req.params.postId),
  ], function(err, post){
    if(err) { return next(err) }
    return res.json(post.getPublicFields())
  })
}


function deletePost(req, res, next) {
  async.waterfall([
    postHelper.getPost(req.params.postId),
    postHelper.deletePost(req.params.postId)
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
