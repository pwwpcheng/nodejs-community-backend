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
