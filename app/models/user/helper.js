// User helper 
// Notice: It is assumed that all id related document
// exists in database. No actions will be taken for 
// missing id in database unless mentioned. 

const async = require('async')
const curry = require('curry')
const User = require('./model').User
const userController = require('./controller')
const ObjectId = require('mongoose').Schema.Types.ObjectId

function createUser(userObj, callback) {
  return function(callback) {
    User.create(userObj, function (err, result) {
      if (err) {
        // Temporarily it's not possible to trigger this error
        // but it's still left here just in case.
        if(err.code === 11000){
          return callback(Error('Email or username already exists'))
        }
        return callback(err)
      }
      return callback(null, result)
    })
  }
}

function updateOneUserBase(selector, content, callback) {
  User.findOneAndUpdate(selector, content, {new: true}, function(err, user) {
    if (err) return next(err)
    return callback(null, user)
  })
}

var updateOneUser = curry(updateOneUserBase)

function updateUserById(userId, content) {
  return updateOneUser({_id: ObjectId(userId)}, content)
}

function updateUserByName(username, content) {
  return updateOneUser({username: username}, content)
}

function deleteOneUser(selector) {
  if (!selector){
    var err = new Error("selector not provided for delete operation")
    err.statusCode = 400
    return function(callback) { callback(err) }
  }

  return function(callback) {
    User.findOneAndRemove(selector)
      .exec(function(err, user) {
        if(err) return next(err)
        if(!user) {
          err = new Error(req.params.username + " does not exist")
          err.statusCode = 404
          return next(err)
        }
        return res.status(204).send()
      })
  }
}  

function deleteUserById(userId) {
  return deleteOneUser({_id: ObjectId(userId)})
}

function deleteUserByName(username) {
  return deleteuserByname({username: username})
}

function getUserById(userId, fields='') {
  return getOneUser({_id: userId}, fields)
}

function getUserByName(username, fields='') {
  return getOneUser({username: username}, fields)
}

function getOneUserBase(selector, fields, callback) {
  if (!selector){
    var err = new Error("selector must be provided")
    err.statusCode = 400
    return callback(err)
  }

  // Get data from db.
  // Here mongodb is assumed to be the data source
  // Furure abstraction on database needs to be implemented.
  User.findOne(selector, fields, function(err, result) {
    if (err) return callback(err)
    if (!result) {
      var e = new Error("User does not exist")
      e.statusCode = 404
      return callback(e)
    }
    return callback(null, result)
  })
}

var getOneUser = curry(getOneUserBase)

function isFriend(userId, friendUserId, callback) {
  var testIsFriend = function(userObj, cb) {
    if (friendUserId in userObj.friends) {
      return cb(null, true)
    } else {
      return cb(null, false)
    }
  }
  async.waterfall([
    getUserById(userId),
    testIsFriend
  ], function(err, result) {
    if (err) { return callback(err) }
    return callback(null, result)
  })
}


// checkFieldExists returns true if {fieldName: value} exists
// in User collection
function checkFieldExists(fieldName, value) {
  var selector = {}
  selector[fieldName] = value
  return function(next) {
    User.findOne(selector, '_id', function(err, result){
      if(err) { next(err) }
      if(result) { next(err, fieldName) }
      else { next(err) }
    })
  }
}

// This function does not check if a groupId is valid
// nor userId in order to satisfy atomicity of helper
// module. Related check should be handled to caller.
function joinGroup(userId, groupId, role='member') {
  var makeMemberObj = function () {
    return  function(callback) {
      var memberObj = {
        joinDate: Date.now(),
        groupId: groupId,
        role: role
      }
      return callback(null, memberObj)
    }
  }
  return function(callback) {
    async.parallel([
      getUserById(userId),
      makeMemberObj(), 
    ], function(err, res) {
      if(err) {return callback(err)}
  
      // Format of res: [user, memberObj]
      var user = res[0]
      var memberObj = res[1]
      User.update(
        {_id: userId, 'joinedGroups.groupId': { $ne: groupId }},
        {$push: {joinedGroups: memberObj}}
        , function(err, res) { 

          // Format of res: 
          // { ok: 1, nModified: 1, n: 0 }
          // If we'd like to tell user that he's already joined the group
          // we could read nModified and judge if it's 0

          if(err) { return callback(new Error(err)) }
          return callback(null, true)
        })
    })
  }
}

function leaveGroup(userId, groupId) {
  var selector = {_id: userId}
  var content = {$pull: {joinedGroups: {groupId: groupId}}}

  return function(callback) {
    async.parallel([
      getUserById(userId),
      updateOneUser(selector, content)
    ], function(err, res) {
      if(err) {return callback(err)}
      return callback(null, true)
    })
  }
}

function unpinGroup(userId, groupId) {
  var selector = { _id: userId }
  var content = {$pull: {pinnedGroups: {groupId: groupId}}}

  return function(callback) {
    async.series([
      getUserById(userId),
      updateOneUser(selector, content)
    ], function(err, res) {
      return callback(null, true)
    })
  }
}

// PinGroup operation is idempotential
// User's pinning same group multiple times 
// will not create duplicated items in the array
function pinGroup(userId, groupId) {
  var makePinnedGroupObj = function(callback) {  
    var pinnedGroupObj = {
      groupId: groupId,
      pinDate: Date.now(),
    }
    return callback(null, pinGroupObj)
  } 
 
  var makeContent = function(pinnedGroup, callback) {
    var content = {
      $push: {
        pinnedGroups: pinnedGroup
      }
    }
    return callback(null, content)
  }
 
  var selector = {_id: userId}

  var update = updateOneUser(selector) 
   
  return function(callback) {
    async.waterfall([
      makePinnedGroupObj,
      makeContent,
      update
    ], function(err, res) {
      if(err) { return callback(err) }
      return callback(null, true)
    })
  }
}

module.exports = {
  createUser: createUser,
  updateOneUser: updateOneUser,
  updateUserByName: updateUserByName,
  updateUserById: updateUserById,
  deleteOneUser: deleteOneUser,
  checkFieldExists: checkFieldExists,
  getOneUser: getOneUser,
  getUserByName: getUserByName,
  getUserById: getUserById,
  isFriend: isFriend,
  joinGroup: joinGroup,
  leaveGroup: leaveGroup,
  pinGroup: pinGroup,
  unpinGroup: unpinGroup,
} 
