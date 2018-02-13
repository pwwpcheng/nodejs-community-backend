const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const Post = require('./model').Post
const postModel = require('./model')

var makeFields = curry(function(fields, callback) {
  if(!fields) {return ""}
  
  let _fields = []
  if(fields.id) { _fields.push("_id")  }
  if(fields.date) { _fields.push("createdAt")  }
  if(fields.userId) { _fields.push("userId")  }
  
  return _fields.join(' ')
})

var makeSorter = function(fields) {
  var sorter = {}
  if(!fields) {return sorter}
  if(fields.date) { sorter.createdAt = fields.date }
  return sorter
}

var makePost = function(postData) {
  try {
    let postGroup = makePostGroup(postData.groupId),
        postStatistics = makePostStatistics(postData.statistics),
        postContent = makePostContent(postData)
   
    let postDocument = {
      userId: postData.userId,
      createdAt: postData.createdAt,
      groups: postGroup,
      statistics: postStatistics,
      content: postContent,
    }
       
    if(postData.loc) {
      postDocument['location'] = makePostLoc(postData.location)
    }
    
    if(postData.permissions) {
      postDocument['permissions'] = makePostPermission(postData.permissions)
    }
    
    return postDocument
  } catch(err) {
    err.statusCode = 500
    throw err
  }
}

var makePostStatistics = function(s) {
  var statistics = s || {}
  var stats = new postModel.PostStatistics({
    replayCount: statistics.replayCount || 0,
    viewsCount: statistics.viewsCount || 0,
  })
  return statistics
}

var makePostGroup = function(groupId) {
  var postGroupObj = new postModel.PostGroup({
    addDate: Date.now(),
    groupId: groupId,
  })
  return postGroupObj
}

var makePostContent = function(postData) {
  var content = new postModel.PostContent({
    text: postData.text || '',
    media: [postData.mediaId],
    contentType: postData.type,
  })
  return content
}

var makePostLocation = function(location){
  // Temporarily I don't know how to deal with this one.
  throw new Error("location in Post not implemented") 
}

var getPosts = curry(function(selector, fields, sortField, callback) {
  Post.find(selector)
      .select("_id")
      .sort(sortField)
      .exec(function(err, posts){
              if(err) { return callback(err) }
              return callback(null, posts)
      })
})

var getPostsByGroupId = function(groupId, fields, sortField) {
  let selector = {"groups.groupId": groupId}
  let _fields = fields || ""
  let _sortField = sortField || {}
  return getPosts(selector, _fields, _sortField)
}

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

var createPostBase = curry(function(content, callback){
  Post.create(content, function(err, result) {
    if(err) { return callback(err) }
    return callback(null, true)
  })
})

var createPost = curry(function(postData, callback){
  try {
    let postDocument = makePost(postData)
    return createPostBase(postDocument, callback)
  } catch(err) {
    err.statusCode = err.statusCode || 500
    return callback(err)
  }
})

var deletePost = curry(function(selector, callback) {
  Post.findOneAndRemove(selector, function(err, post){
    if(err) { return callback(err) }
    if(!post) { 
      var err = new Error('Post "' + selector + '" does not exist')
      err.statusCode = 404
      return callback(err)
    } else {
      return callback(null, post)
    }
  })
})

var increaseView = curry(function(postId, callback){
     
})

function deletePostById(postId) {
  return deletePost({_id: postId})
}

module.exports = {
  getPost: getPost,
  getPostById: getPostById,
  getPosts: getPosts,
  getPostsByGroupId: getPostsByGroupId,
  createPost: createPost,
  deletePost: deletePost,
  deletePostById: deletePostById,
  //updatePost: updatePost,
  makePost: makePost,
  makePostContent: makePostContent,
  makeSorter: makeSorter,
  makeFields: makeFields,
}

