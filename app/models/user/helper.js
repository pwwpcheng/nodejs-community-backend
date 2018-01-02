const async = require('async')
const User = require('./model').User
const userController = require('./controller')

function createUser(userObj) {
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

function updateOneUser(username, updatedUser) {
  return function(callback) {
    User.findOneAndUpdate({username: username}, updatedUser, {new: true}, function(err, user) {
      if (err) return next(err)
      //if (req.user.username !== req.params.username) {
      //  var err = new Error("You are only allowed to update your own profile")
      //  err.statusCode = 400
      //  return callback(err)
      //} 
      return callback(null, user)
    })
  }
}

function deleteOneUser(userId, username) {
  // Since userId and username are all unique in db,
  // a spefic user can be found by providing any one
  // of these two parameters.
  
  // At least userId or username shall be provided
  if (!userId && !username){
    var err = new Error("Either userId or username should be not null")
    err.statusCode = 400
    return function(callback) { callback(err) }
  }
 
  // If userId is provided, username will be ignored
  var selector = {}
  if (userId) {selector['_id'] = userId}
  if (username) {selector['username'] = username}

  return function(callback) {
    User.findOneAndRemove({username: req.params.username})
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

function getOneUser(userId, username) {
  // Since userId and username are all unique in db,
  // a spefic user can be found by providing any one
  // of these two parameters.
  
  // At least userId or username shall be provided
  if (!userId && !username){
    var err = new Error("Either userId or username should be not null")
    err.statusCode = 400
    return function(callback) { callback(err) }
  }
 
  // If userId is provided, username will be ignored
  var selector = {}
  if (userId) {selector['_id'] = userId}
  if (username) {selector['username'] = username}

  // Get data from db.
  // Here mongodb is assumed to be the data source
  // Furure abstraction on database needs to be implemented.
  return function(callback) {
    User.findOne(selector, function(err, result) {
      if (err) return callback(err)
      if (!result) {
        var e = new Error("User does not exist")
        e.statusCode = 404
        return callback(e)
      }
      return callback(null, result)
    })
  }  
}


function isFriend(userId, friendUserId, callback) {
  var testIsFriend = function(userObj, cb) {
    if (friendUserId in userObj.friends) {
      return cb(null, true)
    } else {
      return cb(null, false)
    }
  }
  async.waterfall([
    getOneUser(userId),
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

function makeMemberObj(groupId, role='admin') {
  return  function(callback) {
    var memberObj = {
      joinDate: Date.now(),
      groupId: groupId,
      role: role
    }
    return callback(null, memberObj)
  }
}

// This function does not check if a groupId is valid
// nor userId in order to satisfy atomicity of helper
// module. Related check should be handled to caller.
function joinGroup(userId, groupId, role='admin') {
  return function(callback) {
    async.parallel([
      getOneUser(userId),
      makeMemberObj(groupId), 
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
  return function(callback) {
    async.parallel([
      getOneUser(userId),
    ], function(err, res) {
      if(err) {return callback(err)}
  
      // Format of res: [user, memberObj]
      var user = res[0]
      var memberObj = res[1]

      User.update(
        {_id: userId},
        {$pull: {joinedGroups: {groupId: groupId}}}
        , function(err, res) {
          // Format of res: 
          // { ok: 1, nModified: 1, n: 0 }
          // If we'd like to tell user that he's already left the group
          // we could read nModified and judge if it's 0

          if(err) { return callback(new Error(err)) }
          return callback(null, true)
        })
    })
  }
}

module.exports = {
  createUser: createUser,
  updateOneUser: updateOneUser,
  deleteOneUser: deleteOneUser,
  checkFieldExists: checkFieldExists,
  getOneUser: getOneUser,
  isFriend: isFriend,
  joinGroup: joinGroup,
  leaveGroup: leaveGroup,
} 
