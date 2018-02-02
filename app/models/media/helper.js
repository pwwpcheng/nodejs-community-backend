const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const Media = require('./model').Media
const S3Helper = require('../storage/s3/helper')


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

function getSignedPutRequest(storageType='s3', callback) {
  if (storageType === 's3') {
    return S3Helper.getPutRequest(callback)
  } else {
    let err = new Error(storageType + ' not implemented')
    err.statusCode = 500
    return callback(err)
  }
}

function getMediaBase(selector, callback) {
  Media.find(selector, function(err, result) {
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
}
