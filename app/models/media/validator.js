const validator = require('express-validator')

// TODO(cheng)
// NOT ELEGANT WAY FOR VALIDATION
// Same field check with req.checkBody is repeated in every 
// validator function. This is not desired since changing 
// schema for one field requires changing all related req.checkBody
// This needs to change in the future.

function validateMediaUpdate(req, res, next) {
  req.sanitize('mediaId').toString()
  req.checkBody('mediaId', "mediaId should be of type ObjectId").matches(/^[a-z\d]{24}$/)
  var err = req.validationErrors()
  
  // temporarily we report one error at a time
  // until there are solutions for reporting multiple
  // errors in error handler
  if (err) {
    var returnError = new Error(err[0].msg)
    returnError.statusCode = 400
    return next(returnError)
  }
  return next()
}

function validateMediaGet(req, res, next) {
  req.sanitize('mediaId').toString()
  req.check('mediaId', "mediaId should be of type ObjectId").matches(/^[a-z\d]{24}$/)
  var err = req.validationErrors()
  
  // temporarily we report one error at a time
  // until there are solutions for reporting multiple
  // errors in error handler
  if (err) {
    var returnError = new Error(err[0].msg)
    returnError.statusCode = 400
    return next(returnError)
  }
  return next()
}

module.exports = {
  setValid: validateMediaUpdate,
  get: validateMediaGet,
}
