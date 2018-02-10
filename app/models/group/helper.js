const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const Group = require('./model').Group
const geoHelper = require('../geo/helper')

// Check if a document with {fieldName: value} exists
// fieldName: String
// value: Object
// return: false if not exist;
//         id of duplicated item if exists
function checkFieldExists(fieldName, value) {
  var selector = {}
  selector[fieldName] = value
  return function(callback) {
    Group.findOne(selector, '_id', function(err, result) {
      if(err) {return callback(err) }
      if(!result) { return callback(null, false) }
      return callback(null, result._id)
    })
  }
}

var createGroupBase = curry(function(groupObj, callback) {
  Group.create(groupObj, function(err, result) {
    if(err) {
      if (err.code == 11000) {
        err.statusCode = 400
        return callback(err)
      }
      return callback(err)
    }
    return callback(null, result)
  })
})

var makeGroupStatisticsContent = curry(function(data, callback) {
  return callback(null, {})
})

var makeGroupPermissionsContent = curry(function(data, callback) {
  return callback(null, {})
})

var createGroup = curry(function(data, callback) {
  async.parallel([
    geoHelper.makeGeoContent(data.location),
    makeGroupStatisticsContent(data.statistics),
    makeGroupPermissionsContent(data.permissions),
  ], function(err, res){
    if(err) { return callback(err) }
    let groupContent = {
      groupname: data.groupname,
      alias: data.alias,
      location: res[0],
      creator: data.creator,
      createdAt: data.createdAt,
      groupImageId: data.groupImageId,
      statistics: res[1],
      permisions: res[2],
    }
    
    // Removed undefined fields
    groupContent = JSON.parse(JSON.stringify(groupContent))

    return createGroupBase(groupContent, callback)
  }) 
})

function makeMemberObj(groupId, role='member') {
  return function(callback) {
    var memberObj = {
      groupId: groupId,
      role: role
    }
    return callback(null, memberObj)
  }
}

var getGroupBase = curry(function(selector, callback) {
  Group.findOne(selector, function(err, result) {
    if(err) return callback(err)
    if(!result) {
      var e = new Error('Group (name: "' + JSON.stringify(selector) + '") does not exist.')
      e.statusCode = 404
      return callback(e)
    }
    return callback(null, result)
  })
})

function getGroupById(groupId) {
  return getGroupBase({_id: groupId})
}

function getGroupByName(groupname) {
  return getGroupBase({groupname: groupname})
}

function getGroupPostsBase(groupId, callback) {
  async.waterfall([
    getGroupById(groupId),
    
  ], function(err, res) {
  })
}

var getGroupPosts = curry(getGroupPostsBase)

module.exports = {
  createGroup: createGroup,
  getGroup: getGroupBase,
  getGroupById: getGroupById,
  getGroupByName: getGroupByName,
  checkFieldExists: checkFieldExists
}
