//                    Overall POST ACL policy
//
//  +------------+-------------+-------------+-------------+-------------+
//  |      Role  |     Self    |  Community  |    Friend   |    Admin    |
//  + Post\ Oper +-------------+-------------+-------------+-------------+
//  | Type\ation | Read | Edit | Read | Edit | Read | Edit | Read | Edit |
//  +------------+------+------+------+------+------+------+------+------+
//  | Private    |   X  |   X  |      |      |      |      |   X  |   X  |
//  +------------+------+------+------+------+------+------+------+------+
//  | Friend     |   X  |   X  |      |      |   X  |      |   X  |   X  |
//  +------------+------+------+------+------+------+------+------+------+
//  | Community  |   X  |   X  |   X  |      |   X  |      |   X  |   X  |
//  +------------+------+------+------+------+------+------+------+------+
//  | Public     |   X  |   X  |   X  |      |   X  |      |   X  |   X  |
//  +------------+------+------+------+------+------+------+------+------+
//
// ACL naming correspondence:
// Node ACL name -> Name used in this file
//    Role       -> role
//    Resource   -> postType
//    Permission -> operation(opr)
// 

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
        roles: 'testPostRole',
        allows: [{resources: 'testResource', permissions: 'testPermission'}]
      },
      {
        roles: ['self', 'admin'], 
        allows: [{
                    resources: ['privatePost', 'friendPost', 'communityPost', 'publicPost'], 
                    permissions: ['read', 'edit']
                }]
      },
      {
        roles: ['friend'],
        allows: [{
                    resources: ['friendPost', 'communityPost', 'publicPost'],
                    permissions: ['read']
                }]
      },
      {
        roles: ['community'],
        allows: [{
                    resources: ['communityPost', 'publicPost'],
                    permissions: ['read']
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
    acl.addUserRoles('testUser', 'testPostRole_1.0', function(err) {
      return callback(err, false)
    })
    return callback(null, true)
  }

  // Check if acl policies are initialized
  var checkPolicyInitialized = function(callback) {
    acl.hasRole('testUser', 'testPostRole_1.0', function(err, result) {
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

function checkGetPostPermission(user) {
  return function(post, callback) { 
    if (post.permissions.permissionType === 'public') 
      return callback(null, post)
    if (post.permissions.permissionType === 'private') {
      var err = new Error('Permission denied: private post')
      err.statusCode = 403
      return callback(err, null)
    }
    return callback(null, post) 
  }
}

function getPostType(postId) {
  return function(callback) {
    async.waterfall([
      postHelper.getPost(postId),
      function(post, callback) {
        callback(null, post.permissions)
      }
    ], function(err, result) {
      if(err) {
        return callback(err)
      }
      if(!result) { 
        // Permission field does not exist in this post,
        // we hereby assume the post is private
        return callback(null, 'privatePost')
      }
      return callback(null, result.permissionType)
    })
  }
}

function getUserRole(userId) {
  return function(callback) {
    async.waterfall([], function(err, result) {
      if(err) {
        return callback(err)
      }
      // This function is not fully implemented!
      return callback(null, 'self')
    })
  }
}

function checkGetPermission(){
  return function(req, res, next) {
    async.parallel([
      // These three functions won't affect each other,
      // so here they are executed in parallel
      initAclPolicies,
      getPostType(req.params.postId), 
      getUserRole(req.user._id),
    ], function(err, result) {
      if (err) { return next(err) }
      // result: [true, postType, userRole]
      var postType = result[1],
          userRole = result[2]
      acl.areAnyRolesAllowed(userRole, postType, 'read', function(err, res) {
        if(err) {return next(err) }
        if(!res) {
          var err = new Error("Permission denied by acl policy")
          err.statusCode = 403
          return next(err)
        }
        return next()
      })
    })
  }
}

module.exports = {
  get: checkGetPermission,
}
 
