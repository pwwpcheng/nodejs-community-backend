/**
 * Module dependencies.
 */
const async = require('async')
const groupHelper = require('../group/helper')
const userHelper = require('./helper')

function createUser(req, res, next) {
  var checkField = function(fieldName) {
    return function(callback) {
      var _checker = userHelper.checkFieldExists(fieldName, req.body[fieldName])
      return _checker(function(err, res){
        if(err) {return next(err)}
        if (res === true) {
          var err = new Error(fieldName + " already exists")
          err.statusCode = 403
          next(err)
        }
        callback(null, false)
      })
    }
  }

  async.waterfall([
    checkField('username'),
    checkField('email'),
    userHelper.createUser(req.body)
  ], function(err, result) {
    if (err) { next(err) }
    return next(null, result.getPrivateFields())
  })
}

function getUser(req, res, next) {
  var getType = function(callback) {
    // TODO: 
    // Add friend relationship condition
    if (req.params.username === req.user.username) {
      callback(null, 'self')
    } else if (req.user.role === 'admin'){
      callback(null, 'admin')
    } else {
      callback(null, 'others')
    }
  }
  async.waterfall([
      userHelper.getOneUser(null, req.params.username)
    ], function(err, result){
      if(err) { return next(err) }
      return res.json(result.getPublicFields())
    }
  )
}

function updateUser(req, res, next) {
  var callback = function(err, updatedUser) {
    if (err) { return next(err) }
    return updatedUser.getPrivateFields()
  }

  var updater = userHelper.updateOneUser(req.params.username, req.body)
  return updater(callback)
}

function deleteUser(req, res, next) {
  var callback = function(err, res) {
    if(err) { return next(err) }
    return res.status(204).send()
  }

  var deleter = userHelper.deleteOneUser(null, req.params.username)
  return deleter(callback)
}

function isFriendCheck(req, res, next) {
  userHelper.isFriend(req.user._id, req.query.b, function(err, result) {
    if (err) { return next(err) }
    return res.json(result)
  }) 
}

module.exports = {
  create: createUser,
  get: getUser,
  update: updateUser,
  delete: deleteUser,
  isFriend: isFriendCheck,
}
