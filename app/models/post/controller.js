const async = require('async')
const mongoose = require('mongoose')
const Post = require('./model').Post

// This function is not completed.
function makeSelector(req) {
  return function(callback) {
    if(req.param) {}
  }
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

function checkModifyPostPermission (sessionUser) {
  return function(post, callback) {
    // Role has not been implemented. Here is just an example
    // of allowing admin to operate on all posts
    if(sessionUser.role === 'admin' ) {
      callback()
    } else if(sessionUser._id.equals(post.userId) ) {
      callback()
    } else {
      var err = new Error("Permission denied")
      err.statusCode = 403
      callback(err)
    }
  }
}

function checkGetPostPermission(user, community) {
  return function(post, callback) { 
    if (post.permissions.permissionType === 'public') 
      return callback(null, post)
    if (post.permissions.permissionType === 'private') {
      var err = new Error('Permission denied: private post')
      err.statusCode = 403
      return callback(err, null)
    }
    if (post.permissions.permissionType === 'community') {
      if (!community) {
        var err = new Error('Permission denied: community not provided')
        err.statusCode = 403
        callback(err)
      }
      console.log("Currently communityId is not checked in Post permissions. This get opr will be allowed.")
      return callback(null, post)
    }
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

function getPostFromDb(postId) {
  return function(callback) {
    Post.findOne({_id: postId}, function(err, post) {
      if(err) {
        callback(err)
      } else if (!post) {
        var err = new Error('Post(id:"' + postId + '") not found.')
        err.statusCode = 400
        callback(err)
      } else {
        callback(null, post)
      }
    })
  }
}

function deletePostFromDb(postId) {
  return function(callback) {
    Post.findOneAndRemove({_id: postId}, function(err, post){
      if(err) { return callback(err) }
      if(!post) { 
        var err = new Error('Post (id: "' + postId + '" does not exist')
        err.statusCode = 404
        callback(err)
      } else {
        callback(null, post)
      }
    })
  }
}
    

function getPost(req, res, next) {
  async.waterfall([
    getPostFromDb(req.params.postId),
    checkGetPostPermission(req.user),
  ], function(err, post){
    if(err) { return next(err) }
    return res.json(post.getPublicFields())
  })
}


function deletePost(req, res, next) {
  async.waterfall([
    getPostFromDb(req.params.postId),
    checkModifyPostPermission(req.user),
    deletePostFromDb(req.params.postId)
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
