const async = require(async)
const mongoose = require('mongoose')
const Group = require('./model').Group
const groupHelper = require('./helper')

function getGroup(req, res, next) {
  async.waterfall([
    groupHelper.getGroup(null, req.params.groupname)
  ], function(err, result) {
    if(err) { return next(err) }
    return res.json(result.getProtectedFields())
  }
}

function updateGroup() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  }
}

function createGroup() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  }
}

function removeGroup() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  } 
}

module.exports = {
  get: getGroup(),
  create: createGroup(),
  update: updateGroup(),
  delete: removeGroup()
}
