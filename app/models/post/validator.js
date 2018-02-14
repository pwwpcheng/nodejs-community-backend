const validator = require('express-validator')
const geoValidator = require('../geo/validator')

function validatePostPermissions(req, callback) {
  // Temporarily not implemented
  if (err) {
    var returnError = err
    returnError.statusCode = 400
    return callback(returnError)
  }
  return callback()
}

function validatePostStatistics(req, callback) {
  req.check('statistics.replayCount', 'replayCount should be a positive integer').isInt({min: 0})
  req.check('statistics.viewsCount', 'viewsCount should be a positive integer').isInt({min: 0})
  
  let err = req.validationErrors()     
  if (err) {
    var returnError = err
    returnError.statusCode = 400
    return callback(returnError)
  }
  return callback()
}

function validatePostCreate(req, res, next) {
  let subValidatorCallback = function(err) {
    if(err) { return next(err) }
  }

  req.check('type', 'type should be one of text/image/video').isIn(['text', 'image', 'video', 'mixed'])
  req.check('groupId', 'groupId should be of type ObjectId').matches(/^[a-z0-9]{24}$/)
  req.check('mediaId', 'groupId should be of type ObjectId').matches(/^[a-z0-9]{24}$/)
  
  if(req.body.location) {
    geoValidator.geo(req, res, subValidatorCallback)
  }

  let err = req.validationErrors()     
  if (err) {
    var returnError = err
    returnError.statusCode = 400
    return next(returnError)
  }
  return next()
}

function validatePostId(req, res, next) {
  req.check('postId', 'postId should be of type ObjectId').matches(/^[a-z0-9]{24}$/)

  let err = req.validationErrors()     
  if (err) {
    var returnError = err
    returnError.statusCode = 400
    return next(returnError)
  }
  return next()
}

var validatePostGet = validatePostId,
    validatePostDelete = validatePostId
    
module.exports = {
  create: validatePostCreate,
  get: validatePostGet,
  delete: validatePostDelete,
}
