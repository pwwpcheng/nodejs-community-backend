const async = require('async')
const mongoose = require('mongoose')
const curry = require('curry')
const geoModel = require('./model')

var makeGeoContent = curry(function(data, callback) {
  if(!data) {
    return callback(null, undefined)
  }
  
  let requiredFields = ['longitude', 'latitude', 'radius']
  for(var i = 0; i < requiredFields.length; i++) {
    if (!data[requiredFields[i]]) {
      let err = new Error('"' + requiredFields[i] + '" should be provided with data"')
      err.statusCode = 500
      return callback(err)
    }
  }

 let geoContent = {
    coordinates: [data.longitude, data.latitude],
    radius: data.radius
  }
  
  return callback(null, geoContent)
})

var create = curry(function(data, callback){
  try{
    var geoDocument = new geoModel.Geo()
    return callback(null, geoDocument)
  } catch(err) {
    err.statusCode = 500
    return callback(err)
  } 
})

module.exports = { 
  makeGeoContent: makeGeoContent,
  create: create,
}
