const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const Post = require('./model').Post
const PostGroup = require('./model').PostGroup
const PostContent = require('./model').PostContent

function makePost(postData, userId) {
  return function(postContent, callback) {
    var data = {
      userId: userId,
      postTime: Date.now(),
      content: postContent
    }
    if(postData.communityId) {
      data['communityId'] = postData.communityId
    }
    if(postData.loc) {
      data['loc'] = postData.loc
    }
    if(postData.permissions) {
      data['permissions'] = {
        permissionType: postData.permissions
      }
    }
    callback(null, data)
  }
}

var makePostGroup = function(groupId) {
  var postGroupObj = new PostGroup({
    addDate: Date.now(),
    groupId: groupId,
  })

  return function(callback) {
    callback(null, postGroupObj)
  }
}

function makePostContent(postData) {
  var contentData = {
    // Temporarily all url submitted with the post
    // are images/videos stored in AWS S3.
    // Hereby all mediaUrl are treated as S3 Url
    
  }

  return function(callback) {
    var content = {
      text: contentData.text || ''
    }
    if (postData.media) {
      content[media] = contentData.media,
      content[contentType] = contentData.contentType
    }
    callback(null, content)
  }
}


function getPostBase(selector, callback) {
  Post.findOne(selector, function(err, post) {
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

var getPost = curry(getPostBase)

var getPostById = function(postId) {
  return getPost({_id: postId})
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

