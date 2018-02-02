//                 User's ACL policies
//
// +------------+--------+--------+-------+---------+
// |    User    | public | member | admin | blocked |
// +------------+--------+--------+-------+---------+
// | search     |        |    X   |   X   |         |
// +------------+--------+--------+-------+---------+
// | createUser |    X   |        |   X   |         |
// +------------+--------+--------+-------+---------+
// | getUser    |        |    X   |   X   |         |
// +------------+--------+--------+-------+---------+
// | editUser   |        |  self* |   X   |         |
// +------------+--------+--------+-------+---------+
// | addFriend  |        |  self* |   X   |         |
// +------------+--------+--------+-------+---------+
// | unfriend   |        |  self* |   X   |         |
// +------------+--------+--------+-------+---------+
//
// *self: When user has role as "member", and the user object 
//        to modify has the same userId as logged in user 
//        (simply put, user is modifying himself), then the 
//        role is defined as "self"
//
//               ACL term <-> project term
//
//  Role        <->   userType
//  User        <->   user._id
//  Resource    <->   community_<communityId>
//  Permission  <->   operations [search|join|viewPost|addPost...]


const acl = require('../../middlewares/acl')
const async = require('async')
const postHelper = require('./helper')
const userHelper = require('../user/helper')

// This function act as initialization for overall acl policy
// and should be idempotential. Here a test policy is used to
// ensure that function is executed only once.
function initAclPolicies(cb) {
  var initPolicy = function(isInitialized, callback) {
    if(isInitialized) { return callback(null, true) }
    acl.allow([
      { 
        roles: 'testUserRole_1.0',
        allows: [{resources: 'testResource', permissions: 'testPermission'}]
      },
      {
        roles: ['member'], 
        allows: [{
                    resources: ['publicCommunity'], 
                    permissions: ['search', 'join', 'getInfo', 'viewMembers', 'viewPost',
                                  'addPost', 'addMember']
                },
                {
                    resources: ['privateCommunity'], 
                    permissions: ['getInfo', 'viewMembers', 'viewPost', 'addPost'] 
                }]
      },
      {
        roles: ['editor'], 
        allows: [{
                    resources: ['publicCommunity'], 
                    permissions: ['search', 'join', 'getInfo', 'viewMembers', 'viewPost',
                                  'addPost', 'editPost', 'addMember']
                },
                {
                    resources: ['privateCommunity'], 
                    permissions: ['getInfo', 'viewMembers', 'viewPost', 'addPost',
                                  'editPost', 'addMember'] 
                }]
      },
      {
        roles: ['admin'], 
        allows: [{
                    resources: ['publicCommunity'], 
                    permissions: ['*']
                },
                {
                    resources: ['privateCommunity'], 
                    permissions: ['*'] 
                }]
      },
    ], function(err, result) {
      if(err) {
        return callback(err)
      }
      return callback(null, true)
    })
  }
 
  // Set test rule 
  var setTestRule = function(isInitialized, callback){
    if (isInitialized) { return callback(null, true) }
    acl.addUserRoles('testUser', 'testGroupRole_1.0', function(err) {
      return callback(err, false)
    })
    return callback(null, true)
  }

  // Check if acl policies are initialized
  var checkPolicyInitialized = function(callback) {
    acl.hasRole('testUser', 'testGroupRole_1.0', function(err, result) {
      console.log(err, result)
      return callback(err, result)
    })
  }
  
  async.waterfall([
    checkPolicyInitialized,
    initPolicy,
    setTestRule 
  ], function(err, result) {
    if(err) { return cb(err) }
    cb(null, true)
  })
}

function getUserType(username, callback) {
  
}

function checkSearchPermission() {
  return function(req, res, next) {
    return next()
  }
}    

function checkGetPermission() {
  return function(req, res, next) {
    
  }
}


module.exports = {
  search: checkSearchPermission,
  get: checkGetPermission,
} 
