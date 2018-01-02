const async = require('async')
const groupHelper = require('./helper')
const userHelper = require('../user/helper')

function getGroup(req, res, next) {
  async.waterfall([
    groupHelper.getGroup(null, req.params.groupname)
  ], function(err, result) {
    if(err) { return next(err) }
    return res.json(result.getProtectedFields())
  })
}

function updateGroup() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  }
}

function createGroup() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  }
}

function removeGroup() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  } 
}

function joinGroup(req, res, next) { 
  var groupname = req.params.groupname
  var userId = req.user._id
  var getGroupIdFromName = function(callback) {
    var _checker = groupHelper.checkFieldExists('groupname', groupname)
    return _checker(function(err, res) {
        if(err) {return next(err)}
        if (res === false) {
          var err = new Error('Group "' + fieldName + '" does not exist')
          err.statusCode = 404
          next(err)
        }
        callback(null, res)
    })
  }

  async.waterfall([
    getGroupIdFromName,
    function(groupId, callback) {
      var helper = userHelper.joinGroup(userId, groupId)
      helper(function(err, res) {
        if(err) { return callback(err) }
        return callback(null, res)
      })
    }
  ], function(err, result){
    if(err) { return next(err) }
    if(!res) {
      return next(new Error('Unknown error'))
    }
    return res.status(204).send()
  }) 
}

function leaveGroup(req, res, next) { 
  var groupname = req.params.groupname
  var userId = req.user._id

  var getGroupIdFromName = function(callback) {
    var _checker = groupHelper.checkFieldExists('groupname', groupname)
    return _checker(function(err, res) {
        if(err) {return next(err)}
        if (res === false) {
          var err = new Error('Group "' + fieldName + '" does not exist')
          err.statusCode = 404
          next(err)
        }
        callback(null, res)
    })
  }

  async.waterfall([
    getGroupIdFromName,
    function(groupId, callback) {
      var helper = userHelper.leaveGroup(userId, groupId)
      helper(function(err, res) {
        if(err) { return callback(err) }
        return callback(null, res)
      })
    }
  ], function(err, result){
    if(err) { return next(err) }
    if(!res) {
      return next(new Error('Unknown error'))
    }
    return res.status(204).send()
  }) 
}


module.exports = {
  get: getGroup,
  joinGroup: joinGroup,
  leaveGroup: leaveGroup,
  create: createGroup(),
  update: updateGroup(),
  delete: removeGroup()
}
