/**
 * Module dependencies.
 */

const mediaHelper = require('./helper.js')

// Need modification
function createMedia(req, res, next) {
  var create = mediaHelper.createMedia(req.body)
  var callback = function(err, result) {
    if (err) { return next(err) }
    return res.json(result.getPublicFields())
  }
  return mediaHelper.createMedia(callback)
}

function getMedia(req, res, next) {
  let mediaId = req.params.mediaId
  let callback = function(err, result) {
    if (err) { return next(err) }
    return res.json(result.getPublicFields())
  }
  return mediaHelper.getMediaById(mediaId)(callback)
}

// Need modification
function updateMedia(req, res, next) {
  let err = new Error('updateMedia not implemented')
  err.statusCode = 400
  next(err)
}

// Need modification
function deleteMedia(req, res, next) {
  let mediaId = request.params.mediaId
  let callback = function(err, result) {
    if (err) { return next(err) }
    return res.status(204).send()
  }
}

function getUploadRequest(req, res, next) {
  let callback = function(err, result) {
    if (err) { return next(err) }
    return res.json(result)
  }
 
  let data = {
    storageType: 's3',
    userId: req.user._id,
    //userId: "5a7a02d5797e0f6abe22b80a",
    mediaType: 'image',
  }
  
  return mediaHelper.getSignedPutRequest(data, callback)
}

function setMediaValid(req, res, next) {
  var mediaId = req.body.mediaId
  if (!mediaId) {
    let err = new Error("mediaId should be provided")
    err.statusCode = 400
    return next(err)
  }
  
  let callback = function(err, result) {
    if (err) { return next(err) }
    if (!result) {
      let err = new Error("Failed to set media as valid. MediaId: " + mediaId)
      err.statusCode = 500
      return next(err)
    }
    return res.status(204).send()
  }
  
  return mediaHelper.setMediaValid(mediaId, callback)
}

module.exports = {
  getUploadRequest: getUploadRequest,
  get: getMedia,
  setValid: setMediaValid,
//  update: updateMedia,
  delete: deleteMedia
}
