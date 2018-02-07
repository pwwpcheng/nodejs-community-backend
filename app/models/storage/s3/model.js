const aws4 = require('aws4')
const async = require('async')
const mongoose = require("mongoose")
const url = require('url')
const Schema = mongoose.Schema
const S3Config = require('../../../config/s3')
//const ModelHelper = require('/model_helper')

var S3StorageSchema = new Schema({
  path: {
    type: String,
    required: true
  },
  bucket: {
    type: String,
    default: S3Config.bucket
  },
  region: {
    type: String
  },
  meta: {
    type: Schema.Types.Mixed
  }
//})
}, {_id: false})

S3StorageSchema
  .virtual('url')
  .get(function() {
    var res = util.format( S3Config.urlFormat, 
                           data.bucket ? data.bucket : S3Config.bucket 
                         ) + data.path
    return res
  })

S3StorageSchema
  .virtual('request')
  .get(function() {
    var ops = {
      service: 's3',
      region: S3Config.region,
      path: this.path,
    }
    return ops
  })

S3StorageSchema
  .virtual('host')
  .get(function(){
    return this.bucket + '.s3.amazonaws.com'
  })

S3StorageSchema.methods.getPutRequest = function(callback) {
  let t = this
  let d = new Date()
  let opt = {
    service: 's3',
    region: S3Config.region,
    method: 'PUT',
    path: t.path,
    host: t.host,
    headers: {
      'X-Amz-Date': d.toUTCString(),
    }
  }

  let createOpt = function(cb) {
    return cb(null, opt)
  }

  let mergeData = function(opt, cb) {
    for (var k in t.meta) {
      opt.header['X-Amz-Metadata-' + k] = data[k]
    }
    return cb(null, opt)
  }
  
  if(typeof(callback) === 'function') {
    // callback provided. use async method
    // to resolve request
    async.waterfall([
      createOpt,
      mergeData,
      signRequest,
    ], function(err, result) {
      if(err) {
        return callback(err)
      }
      return callback(null, result)
    })
  } else {
    // callback not provided. use sync method
    // to resolve request
    // NOTICE: mergeData step is not performed here
    var _cb = function(err, res) {
      if(err) { throw err }
      else { return res }
    }
    return signRequest(opt, _cb)
  }
}

// If false or nothing is passed to this function
// it will directly return GET request content.
// If callback is provided, function will return 
// request data with callback function
S3StorageSchema.methods.getGetRequest = function(callback) {
  let t = this
  let d = new Date()
  let opt = {
    service: 's3',
    region: S3Config.region,
    method: 'GET',
    path: t.path,
    host: t.host,
    headers: {
      'X-Amz-Date': d.toUTCString(),
    }
  }

  let createOpt = function(cb) {
    return cb(null, opt)
  }
  
  if(typeof(callback) === 'function') {
    // callback provided. use async method
    // to resolve request
    async.waterfall([
      createOpt,
      signRequest
    ], function(err, result) {
      if(err) {
        return callback(err)
      }
      return callback(null, result)
    })
  } else {
    // callback not provided. use sync method
    // to resolve request
    var _cb = function(err, res) {
      if(err) { throw err }
      else { return res }
    }
    return signRequest(opt, _cb)
  }
}

function signRequest(opt, cb) {
  try {
    var signedOpt = aws4.sign(opt)
    return cb(null, signedOpt)
  }
  catch (err) {
    return cb(err)
  }
}

S3StorageSchema.methods.getPublicFields = function(callback) {
  var publicObj = {
    request: this.getGetRequest(),
  }
  return callback(null, publicObj)
}

//var s3Storage = mongoose.model('S3Storage', S3StorageSchema) 
//var s3DefaultImage = new s3Storage({
//  path: '/default/default.png',
//})

module.exports = {
  //S3Storage: s3Storage,
  S3StorageSchema: S3StorageSchema,
  //S3DefaultImage: s3DefaultImage,
}
