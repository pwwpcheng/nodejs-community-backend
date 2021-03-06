const validator = require('express-validator')

// TODO(cheng)
// NOT ELEGANT WAY FOR VALIDATION
// Same field check with req.checkBody is repeated in every 
// validator function. This is not desired since changing 
// schema for one field requires changing all related req.checkBody
// This needs to change in the future.

function validateUserCreate() {
  return function (req, res, next) {
    req.sanitize('username').toString()
    req.sanitize('password').toString()
    req.sanitize('email').toString()
    req.sanitize('age').toInt()
    req.sanitize('phone').toString()

    req.checkBody("username", "username should be longer than 5 characters").isLength({min: 5})   
    req.checkBody("username", "username should only contain alphanumerical characters or _")
       .matches(/^[A-Za-z0-9_]+$/)
    req.checkBody("password", "password should be longer than 6 characters").isLength({min: 6})
    req.checkBody("email", "Invalid email").isEmail()
    req.checkBody("age", "age should be between 1 to 100").optional().isInt({min: 1, max: 150})
 
    var err = req.validationErrors()
    
    if (err) {
      var returnError = err
      returnError.statusCode = 400
      return next(returnError)
    }
    return next()
  }
}

function validateUserUpdate(req, res, next) {
  req.sanitize('password').toString()
  req.sanitize('email').toString()
  req.sanitize('age').toString()
  req.sanitize('phone').toString()

  req.checkBody("password", "password should be longer than 6 characters").optional().isLength({min: 6})
  req.checkBody("email", "Invalid email").optional().isEmail()
  req.checkBody("age", "age should be between 1 to 100").optional().isInt({min: 1, max: 150})
  req.checkBody("phone", "Invalid phone number").optional().isMobilePhone('any')

  var err = req.validationErrors()
  
  if (err) {
    var returnError = new Error(err[0].msg)
    returnError.statusCode = 400
    return next(returnError)
  }
  return next()
}

function validateUserGet(req, res, next) {
  req.sanitize('username').toString()
  req.checkBody("username", "username should be longer than 5 characters").isLength({min: 5})   
  req.checkBody("username", "username should only contain alphanumerical characters or _")
     .matches(/^[A-Za-z0-9_]+$/)

  var err = req.validationErrors()
  
  if (err) {
    var returnError = new Error(err[0].msg)
    returnError.statusCode = 400
    return next(returnError)
  }
  return next()
 
}


module.exports = {
  create: validateUserCreate,
  update: validateUserUpdate,
  get: validateUserGet,
}
