//                  Group's ACL policies
//
// +----------------+--------+--------+-------+---------+
// |   PublicGroup  | member | editor | admin | blocked |
// +----------------+--------+--------+-------+---------+
// |     search     |    X   |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |      join      |    X   |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |    viewPost    |    X   |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |     addPost    |    X   |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |    editPost    |        |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |    addMember   |    X   |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |    addEditor   |        |        |   X   |         |
// +----------------+--------+--------+-------+---------+
// | modifySettings |        |        |   X   |         |
// +----------------+--------+--------+-------+---------+
//
// +----------------+--------+--------+-------+---------+
// |  PrivateGroup  | member | editor | admin | blocked |
// +----------------+--------+--------+-------+---------+
// |     search     |        |        |       |         |
// +----------------+--------+--------+-------+---------+
// |      join      |        |        |       |         |
// +----------------+--------+--------+-------+---------+
// |    viewPost    |    X   |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |     addPost    |    X   |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |    editPost    |        |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |    addMember   |        |    X   |   X   |         |
// +----------------+--------+--------+-------+---------+
// |    addEditor   |        |        |   X   |         |
// +----------------+--------+--------+-------+---------+
// | modifySettings |        |        |   X   |         |
// +----------------+--------+--------+-------+---------+
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
        roles: 'testGroupRole_1.0',
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

function getGroupType(groupname) {
  return function(callback) {
    async.series([
      groupHelper.getGroup(null, groupname)
    ], function(err, group) {
      if (err) { return callback(err) } 
      return callback(null, group.permissions.groupType + 'Group')
    })
  }
}

// Considering that a group object might be large 
// when too many people join the group, here 
function getMemberType(groupname, userId) {
  var extractMember = 
  return function(callback) {
    async.series([
      groupHelper.getGroup(null, groupname)
      
    ], function(err, group) {
      if (err) { return callback(err) } 
      return callback(null, group.permissions.groupType + 'Group')
    })
  }
}

function checkSearchPermission() {
  return function(req, res, next) {
    return next()
  }
}    

module.exports = {
  search: checkSearchPermission,
} 
