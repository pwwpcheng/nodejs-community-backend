const validator = require('express-validator')
const geoValidator = require('../geo/validator')

function validateGroupCreate(req, res, next) {
  let subValidatorCallback = function(err) {
    if(err) { return next(err) }
  }
  req.sanitize('groupname').toString()
  req.sanitize('mediaId').toString()
  req.sanitize('alias').toString()
  req.sanitize('description').toString()

  req.checkBody('groupname', 'Group name should be at least 6-30 characters and only contain alphanumerical characters or "_"').matches(/^[a-zA-Z0-9\_]{6,30}$/)
  req.checkBody('mediaId', "mediaId should be of type ObjectId").matches(/^[a-z\d]{24}$/)
  req.checkBody('alias', 'alias should only contain alphanumerical characters').isAlphanumeric()
  req.checkBody('alias', 'alias should be between 3-30 characters').isLength({min: 3, max: 30})
  req.checkBody('description', 'description should be a string').exists()
  
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

function validateGroupName(req, res, next) {
  req.sanitize('groupname').toString()
  req.check('groupname', 'Group name should be at least 6-30 characters and only contain alphanumerical characters or "_"').matches(/^[a-zA-Z0-9\_]{6,30}$/)
  let err = req.validationErrors()  
  if (err) {
    var returnError = err
    returnError.statusCode = 400
    return next(returnError)
  }
  return next()
}

var validateGroupGet = validateGroupName,
    validateGroupDelete = validateGroupName,
    validateGroupJoin = validateGroupName,
    validateGroupLeave = validateGroupName


module.exports = {
  create: validateGroupCreate,
  get: validateGroupGet,
  delete: validateGroupDelete,
  join: validateGroupJoin,
  leave: validateGroupLeave,
}
