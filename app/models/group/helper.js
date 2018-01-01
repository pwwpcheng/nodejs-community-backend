const async = require('async')
const mongoose = require('mongoose')
const Group = require('./model').Group

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
    var selector = {
      _id: groupId, 
      groupname: groupname
    }
    Group.findOne(selector, function(err, result) {
      if(err) return callback(err)
      if(!result) {
        var e = new Error('Group (name: "' + groupname + '") does not exist.')
        e.statusCode = 404
        return callback(e)
      }
      return callback(result)
    })
  }
}

module.exports = {
  getGroup: getGroup
}
