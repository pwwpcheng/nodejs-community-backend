const async = require('async')
const mongoose = require('mongoose')
const Post = require('./model').Post


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


function getPost(postId) {
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

function createPost() {
  return function(content, callback){
    Post.create(content, function(err, result) {
      if(err)
        return callback(err)
      callback(null, true)
    })
  }

}

function deletePost(postId) {
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

module.exports = {
  getPost: getPost,
  createPost: createPost,
  deletePost: deletePost,
  //updatePost: updatePost,
  makePost: makePost,
  makePostContent: makePostContent
}

