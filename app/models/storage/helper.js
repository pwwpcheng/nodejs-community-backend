const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const s3Helper = require('./s3/helper')
const rawHelper = require('./raw/helper')

// createStorageBase: create a storage document
// storageType: (String) one of ['raw', 's3']
// data: (Object) detail for document to create
function createStorageBase(storageType, data, callback) {
  let cb = function(err, res) {
    if(err) { return callback(err) }
    return callback(null, res)
  }

  if(storageType === 's3') {
    return s3Helper.create(data, cb)
  } else if (storageType === 'raw') {
    return rawHelper.create(data, cb)
  } else {
    let err = new Error('createStorage for ' + storageType + ' has not implemented')
    err.statusCode = 501
    return callback(err)
  }
}

var createStorage = curry(createStorageBase)

var getGetRequest = curry(function (storageType, storageDocument, callback) {
  if (storageType === 's3') {
    return s3Helper.getGetRequest(storageDocument, callback)
  } else if (storageType === 'raw') {
    return rawHelper.getGetRequest(storageDocument, callback)
  } else {
    let err = new Error('getGetRequest for ' + storageType + ' has not implemented')
    err.statusCode = 501
    return callback(err)
  }
})


var getPutRequest = curry(function (storageType, storageDocument, callback) {
  if (storageType === 's3') {
    return s3Helper.getPutRequest(storageDocument, callback)
  } else if (storageType === 'raw') {
    return rawHelper.getPutRequest(storageDocument, callback)
  } else {
    let err = new Error('getPutRequest for ' + storageType + ' has not implemented')
    err.statusCode = 501
    return callback(err)
  }
})

module.exports = {
  createStorage: createStorage,
  getPutRequest: getPutRequest,

}
