const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const Post = require('./model').Post
const postModel = require('./model')

var makePost = curry(function(postData, callback) {
  var oprs = [
    makePostGroup(postData),
    makePostContent(postData),
    makePostStatistics(postData)
  ]
  if(postData.loc) {
    oprs.push(makePostLoc(postData))
  }
  //if(postData.permissions) {
  //  oprs.push(makePostPermission(postData.permissions)
  //}
  async.series(oprs, function(err, data) {
    if(err) { return callback(err) }
    return callback(null, postData)
  })
})

var makePostStatistics = curry(function(postContent, callback) {
  var statistics = postContent.statistics || {}
  var stats = new postModel.PostStatistics({
    replayCount: statistics.replayCount || 0,
    viewsCount: statistics.viewsCount || 0,
  })
  postContent.statistics = stats
  return callback(null, postContent) 
})

var makePostGroup = curry(function(postContent, callback) {
  var postGroupObj = new postModel.PostGroup({
    addDate: Date.now(),
    groupId: postContent.groupId,
  })
  postContent.groups = [postGroupObj]
  return callback(null, postContent)
})

var makePostContent = curry(function(postContent, callback) {
  var content = new postModel.PostContent({
    text: postContent.text || '',
    media: [postContent.mediaId],
    contentType: postContent.type,
  })
  postContent.content = content
  return callback(null, content)
})

var makePostLoc = curry(function(postContent, callback){
  // Temporarily I don't know how to deal with this one.
  return callback(null, postContent)
})

var getPost = curry(function(selector, callback) {
  Post.findOne(selector, function(err, post) {
    if(err) {
      callback(err)
    } else if (!post) {
      var err = new Error('Post("' + JSON.stringify(selector) + '") not found.')
      err.statusCode = 400
      callback(err)
    } else {
      callback(null, post)
    }
  })
})

var getPostById = function(postId) {
  return getPost({_id: postId})
}

var createPost = curry(function(content, callback){
  var create = function(postDocument, callback) {
    Post.create(postDocument, function(err, result) {
      if(err) { return callback(err) }
      return callback(null, true)
    })
  }
  
  async.waterfall([
    makePost(content),
    create,
  ], function(err, data) {
    if(err) {return callback(err)}
    return callback(null, data) 
  })
})

var deletePost = curry(function(selector, callback) {
  Post.findOneAndRemove(selector, function(err, post){
    if(err) { return callback(err) }
    if(!post) { 
      var err = new Error('Post "' + selector + '" does not exist')
      err.statusCode = 404
      callback(err)
    } else {
      callback(null, post)
    }
  })
})

function deletePostById(postId) {
  return deletePost({_id: postId})
}

module.exports = {
  getPost: getPost,
  getPostById: getPostById,
  createPost: createPost,
  deletePost: deletePost,
  deletePostById: deletePostById,
  //updatePost: updatePost,
  makePost: makePost,
  makePostContent: makePostContent,
}

