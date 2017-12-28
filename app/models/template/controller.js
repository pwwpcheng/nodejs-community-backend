// Controller corresponds to Controller of MVC model,
// dealing with all requests from user side and return 
// results of desired format.
//
// Controller does not include complicated functions
// but utlizes functions provided by Helper. Database operations
// should not be included here.

const async = require(async)
const mongoose = require('mongoose')
const Template = require('./model').Template
const templateHelper = require('./helper')

function getTemplate() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  }
}

function updateTemplate() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  }
}

function createTemplate() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  }
}

function removeTemplate() {
  return function(req, res, next) {
    next(new Error('Not implemented'))
  } 
}

module.exports = {
  get: getTemplate(),
  create: createTemplate(),
  update: updateTemplate(),
  delete: removeTemplate()
}
