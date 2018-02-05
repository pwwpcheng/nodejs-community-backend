const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const Group = require('./model').Group

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

function makeMemberObj(groupId, role='member') {
  return function(callback) {
    var memberObj = {
      groupId: groupId,
      role: role
    }
    return callback(null, memberObj)
  }
}

function getGroupBase(selector, callback) {
  Group.findOne(selector, function(err, result) {
    if(err) return callback(err)
    if(!result) {
      var e = new Error('Group (name: "' + JSON.stringify(selector) + '") does not exist.')
      e.statusCode = 404
      return callback(e)
    }
    return callback(null, result)
  })
}

var getGroup = curry(getGroupBase)

function getGroupById(groupId) {
  return getGroup({_id: groupId})
}

function getGroupByName(groupName) {
  return getGroup({groupname: groupName})
}

function getGroupPostsBase(groupId, callback) {
  async.waterfall([
    getGroupById(groupId),
    
  ], function(err, res) {
  })
}

var getGroupPosts = curry(getGroupPostsBase)

module.exports = {
  getGroup: getGroup,
  getGroupById: getGroupById,
  getGroupByName: getGroupByName,
  checkFieldExists: checkFieldExists
}
