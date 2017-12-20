const async = require('async')
const mongoose = require('mongoose')
const Post = require('./model').Post

function makeSelector(req) {
  return function(callback) {
    if(req.param) {}
  }
}
  
function getPost(err, req, res, next) { 
  Post.findOne({_id: req.param.postId}, function(err, result) {
    if(err) {
      next(err)
    } else if (!result) {
      var err = new Error('Post(id:"' + postId + '") not found.')
      err.statusCode = 400
      next(err)
    } else {
      return res.json(result.getPublicFields())
    }
  })
}

function makePostContent(reqBody) {
  var contentData = reqBody.content
  return function(callback) {
    var content = {
      text: contentData.text || ''
    }
    if (reqBody.media) {
      content[media] = contentData.media,
      content[contentType] = contentData.contentType
    }
    callback(null, content)
  }
}    

function makePost(reqBody, sessionUser) {
  return function(postContent, callback) {
    var data = {
      userId: sessionUser.id,
      postTime: Date.now(),
      content: postContent
    }
    if(reqBody.communityId) {
      data['communityId'] = reqBody.communityId
    }
    if(reqBody.loc) {
      data['loc'] = reqBody.loc
    }
    if(reqBody.permissions) {
      data['permissions'] = {
        permissionType: reqBody.permissions
      }
    }
    callback(null, data)
  }
}

function createPost(req, res, next) {
  var create = function(data, cb){
    Post.create(data, function(err, result) {
      if(err)
        return next(err)
      cb()
    })
  }
  async.waterfall([
    makePostContent(req.body),
    makePost(req.body, req.user),
    create
  ], function(err, data){
    if(err) {
      next(err)
    } else {
      return res.status(204).send()
    }
  })
} 

module.exports = {
  create: createPost,
  get: getPost
}
