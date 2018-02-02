const aws4 = require('aws4')
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
})

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
    return this.bucketname + '.s3.amazonaws.com'
  })

var s3Storage = mongoose.model('S3Storage', S3StorageSchema) 
var s3DefaultImage = new s3Storage({
  path: '/default/default.png',
})

module.exports = {
  S3Storage: s3Storage,
  S3StorageSchema: S3StorageSchema,
  S3DefaultImage: s3DefaultImage,
}
