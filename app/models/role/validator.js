const validator = require('express-validator')

// TODO(cheng)
// NOT ELEGANT WAY FOR VALIDATION
// Same field check with req.checkBody is repeated in every 
// validator function. This is not desired since changing 
// schema for one field requires changing all related req.checkBody
// This needs to change in the future.

function validateRoleCreate() {
  return function (req, res, next) {
    req.checkBody("name", "name should be longer than 3 characters").isLength({min: 3})   
    req.checkBody("name", "name should only contain alphanumerical characters or _").matches(/^[A-Za-z0-9_]+$/)
 
    var err = req.validationErrors()
    
    // temporarily we report one error at a time
    // until there are solutions for reporting multiple
    // errors in error handler
    console.log(err) 
    if (err) {
      var returnError = new Error(err[0].msg)
      returnError.statusCode = 400
      return next(returnError)
    }
    return next()
  }
}

function validateRoleUpdate() {
  return function (req, res, next) {
    var err = req.validationErrors()
    
    // temporarily we report one error at a time
    // until there are solutions for reporting multiple
    // errors in error handler
    console.log(err) 
    if (err) {
      var returnError = new Error(err[0].msg)
      returnError.statusCode = 400
      return next(returnError)
    }
    return next()
  }
}
module.exports = {
  validateRoleCreate: validateRoleCreate,
  validateRoleUpdate: validateRoleUpdate
}
