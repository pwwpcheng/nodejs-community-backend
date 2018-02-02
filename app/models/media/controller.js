/**
 * Module dependencies.
 */

const MediaHelper = require('./helper.js')

// Need modification
function createMedia(req, res, next) {
  var create = MediaHelper.createMedia(req.body)
  var callback = function(err, result) {
    if (err) { return next(err) }
    return res.json(result.getPublicFields)
  }
  return MediaHelper.createMedia(callback)
}

function getMedia(req, res, next) {
  let mediaId = req.params.mediaId
  let callback = function(err, res) {
    if (err) { return next(err) }
    return res.json(result.getPublicFields())
  }
  return MediaHelper.getMediaById(mediaId)
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
  
  return MediaHelper.getSignedPutRequest('s3', callback)
}

module.exports = {
  getUploadRequest: getUploadRequest,
//  create: createMedia,
  get: getMedia,
//  update: updateMedia,
  delete: deleteMedia
}
