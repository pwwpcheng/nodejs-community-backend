// User helper 
// Notice: It is assumed that all id related document
// exists in database. No actions will be taken for 
// missing id in database unless mentioned. 

const async = require('async')
const curry = require('curry')
const User = require('./model').User
const userController = require('./controller')
const ObjectId = require('mongoose').Schema.Types.ObjectId

var createUserBase = curry(function(userObj, callback) {
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
})

var createUser = createUserBase

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

var deleteOneUserBase = curry(function(selector, callback) {
  User.findOneAndRemove(selector)
    .exec(function(err, user) {
      if(err) return callback(err)
      if(!user) {
        err = new Error("User (" + JSON.stringify(selector) + ") does not exist")
        err.statusCode = 404
        return callback(err)
      }
      return callback(null, user)
    })
})  

var deleteOneUser = deleteOneUserBase

var deleteUserByName = curry(function(username, callback) {
  return deleteOneUser({username: username}, callback)
})

function deleteUserById(userId) {
  return deleteOneUserBase({_id: ObjectId(userId)})
}

var deleteUserByName = curry(function(username, callback) {
  return deleteOneUserBase({username: username}, callback)
})

function getUserById(userId, fields='') {
  return getOneUserBase({_id: userId}, fields)
}

var getUserByName = curry(function(username, fields='') {
  return getOneUserBase({username: username}, fields)
})

var getOneUserBase = curry(function(selector, fields, callback) {
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
})

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
var checkFieldExists = curry(function(fieldName, value, callback) {
  var selector = {}
  selector[fieldName] = value

  let cb = function(err, res) {
    if(err)  {
      if(err.statusCode == 404) {
        return callback(null, false)
      }
      return callback(err)
    }
    if(res) {return callback(null, res)}
  }
  return getOneUserBase(selector, fieldName, cb)
})

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
  deleteUserByName: deleteUserByName,
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
