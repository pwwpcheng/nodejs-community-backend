const async = require(async)
const mongoose = require('mongoose')
const Template = require('./model').Template

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
