const async = require('async')
const User = require('./model').User
const userController = require('./controller')

function getUser(userId, username) {
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
    getUserFromDb(userId),
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
    User.findOne(selector, function(err, result){
      if(err) { next(err) }
      if(result) { next(err, fieldName) }
      else { next(err) }
    })
  }
}

module.exports = {
  checkFieldExists: checkFieldExists,
  getUser: getUser,
  isFriend: isFriend
} 
