// model.js
// Database model and related schema operations
//
// Currently the project only deals with mongodb
// backend, using mongoose to setup connection. All schemas
// and functions in this file should be written under
// mongoose patterns.

const mongoose = require("mongoose")
const Schema = mongoose.Schema
const LocationSchema = require('../geo/model').GeoSchema

var TemplateSchema = new Schema({
}, {
  collection: 'Template'
})

TemplateSchema.methods.getProtectedFields = function() {
  var protectedObj = {
  }
  return protectedObj
}

var template = mongoose.model('Template' , TemplateSchema)
module.exports = {
  Template: template
}
