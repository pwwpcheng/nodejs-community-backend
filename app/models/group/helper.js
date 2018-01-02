const async = require('async')
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

function getGroup(groupId, groupname) {
  return function(callback) {
    if(!groupId && ! groupname) {
      var err = new Error("groupId and groupname cannot both be empty")
      err.statusCode = 400
      return callback(err)
    }
    var selector = {}
    if( groupId ) { selector['_id'] = groupId }
    if( groupname ) { selector['groupname'] = groupname }
    Group.findOne(selector, function(err, result) {
      if(err) return callback(err)
      if(!result) {
        var e = new Error('Group (name: "' + groupname + '") does not exist.')
        e.statusCode = 404
        return callback(e)
      }
      return callback(null, result)
    })
  }
}

module.exports = {
  getGroup: getGroup,
  checkFieldExists: checkFieldExists
}
