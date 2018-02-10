const async = require('async')
const groupHelper = require('./helper')
const userHelper = require('../user/helper')
const postHelper = require('../post/helper')

function getGroup(req, res, next) {
  let getGroupPosts = function(group, callback) {
    let groupId = group._id

    // append post id onto existing group object
    async.parallel([
      postHelper.makeFields(['id']),
      postHelper.makeSorter({date: -1}),
    ], function(err, res){
      // res: [fields, sorter]
      if(err) {return callback(err)}
      let fields = res[0],
          sorter = res[1]
      return postHelper.getPostsByGroupId(groupId, fields, sorter)(
        function(err, posts) {
          if(err) { return callback(err) }
          group.posts = posts
          return callback(null, group)
        })
    })
  }

  let getGroupDetail = function(callback) {
    let cb = function(err, group) {
      if(err) {return callback(err)}
      return callback(null, group.getProtectedFields())
    }
    return groupHelper.getGroupByName(req.params.groupname)(cb)
  }
  
  async.waterfall([
    getGroupDetail,
    getGroupPosts
  ], function(err, result) {
    if(err) { return next(err) }
    return res.json(result)
  })
}

function updateGroup(req, res, next) {
  return next(new Error('Not implemented'))
}

function createGroup(req, res, next) {
  let data = {
    groupname: req.body.groupname,
    alias: req.body.alias || '',
    description: req.body.description,
    location: req.body.location,
    mediaId: req.body.mediaId,
    //creatorId: req.user.id,
    creator: "5a38ab7753ae9e096eac6272",
    createdAt: Date.now(),
    permissions: req.body.persmissions || {},
  }
 
  var callback = function(err, result) {
    if(err) {return next(err)}
    return res.json(result.getPublicFields())
  } 
  return groupHelper.createGroup(data, callback)
}

function removeGroup(req, res, next) {
  return next(new Error('Not implemented'))
}

function joinGroup(req, res, next) { 
  var groupname = req.params.groupname
  var userId = req.user._id
  var getGroupIdByName = function(callback) {
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
    getGroupIdByName,
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

  var getGroupIdByName = function(callback) {
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
    getGroupIdByName,
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
  create: createGroup,
  update: updateGroup,
  delete: removeGroup,
}
