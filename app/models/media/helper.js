const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const Media = require('./model').Media
const storageHelper = require('../storage/helper')

function createMediaBase(content, callback) {
  Media.create(content, function(err, result) {
    if(err) {
      err.statusCode = 500
      return callback(err)
    }
    return callback(null, result)
  })
}

var createMedia = curry(createMediaBase)

function deleteMediaBase(selector, callback) {
  Media.findOneAndRemove(selector)
    .exec(function(err, media) {
      if(err) return callback(err)
      if(!media) {
        err = new Error(req.params.mediaId + " does not exist")
        err.statusCode = 404
        return callback(err)
      }
      return callback(null, true)
    })
}

var deleteMedia = curry(deleteMediaBase)

var deleteMediaById = function(mediaId) {
  return deleteMedia({_id: mediaId})
}

// getSignedPutRequest: create a new media document and return
//                      PUT request for storing media into S3
// data: (Object) related detail of request. 
// data.storageType: (String) Required. One of available storage types
// data.userId: (ObjectId) Required. Creator ID of request.
// data.mediaType: (String) Optional. Reference MediaSchema.mediaType 
function getSignedPutRequest(data, callback) {
  let makeStorageData = function(cb) {
    // Left here for future use.
    return cb(null, {})
  }

  let makeMediaContent = function(storageData, cb) {
    var mediaContent =  {
      creationDate: Date.now(),
      userId: data.userId,
      mediaType: data.mediaType,
      storage: storageData,
      isValid: false,
    }
    return cb(null, mediaContent)
  }

  let getPutRequest = function(mediaDocument, cb) {
    let _cb = function(err, request) {
      if(err) { return cb(err) }
      let res = {
        mediaId: mediaDocument._id,
        request: request
      }
      return cb(null, res)
    }
    return mediaDocument.storage.getPutRequest(_cb)
  }
  
  async.waterfall([
    makeStorageData,
    storageHelper.createStorage(data.storageType),
    makeMediaContent,
    createMedia,
    getPutRequest,
  ], function(err, res){
    if(err) { return callback(err) }
    return callback(null, res)
  })
}

function getMediaBase(selector, callback) {
  Media.findOne(selector, function(err, result) {
    if(err) {
      err.statusCode = 500
      return callback(err)
    }
    if(!result) {
      var e = new Error('Media does not exist')
      e.statusCode = 404
      return callback(e)
    }
    return callback(null, result)
  })
}

var getMedia = curry(getMediaBase)

function getMediaById(mediaId) {
  return getMedia({_id: mediaId})
}

function updateMediaBase(selector, content, callback) {
  Media.findOneAndUpdate(selector, content, {new: true}, function(err, media) {
    if (err) return next(err)
    return callback(null, media)
  })
}

var updateMedia = curry(updateMediaBase)

function setMediaValid(mediaId, callback) {
  async.series([
    getMediaById(mediaId),
    updateMedia({_id: mediaId}, {isValid: true})
  ], function(err, res){
    if(err) {return callback(err)}
    return callback(null, res)
  })
} 

module.exports = {
  createMedia: createMedia,
  getMedia: getMedia,
  getMediaById: getMediaById,
  deleteMedia: deleteMedia,
  deleteMediaById: deleteMediaById,
  getSignedPutRequest: getSignedPutRequest,
  setMediaValid: setMediaValid,
}
