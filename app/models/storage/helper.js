const async = require('async')
const curry = require('curry')
const mongoose = require('mongoose')
const s3Helper = require('./s3/helper')
const rawHelper = require('./raw/helper')

// createStorageBase: create a storage document
// storageType: (String) one of ['raw', 's3']
// data: (Object) detail for document to create
function createStorageBase(storageType, data, callback) {
  if(storageType === 's3') {
    return s3Helper.create(data, callback)
  } else if (storageType === 'raw') {
    return rawHelper.create(data, callback)
  } else {
    let err = new Error('storageType for ' + storageType + ' has not implemented')
    err.statusCode = 501
    return callback(err)
  }
}

var createStorage = curry(createStorageBase)

module.exports = {
  createStorage: createStorage,
}
