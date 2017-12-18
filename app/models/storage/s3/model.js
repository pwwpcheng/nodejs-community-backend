const mongoose = require("mongoose")
const Schema = mongoose.Schema
const S3Config = require('../../../config/s3')
const S3Helper = require('../../../storages/s3/helper')

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
  urlType:{
    type: String,
    enum: ['host-style', 'path-style'],
    default: 'host-style'
  },
  meta: {
    type: Schema.Types.Mixed
  }
})

S3StorageSchema
  .virtual('url')
  .set(function(url) {
    var data = S3Helper.extractFromUrl(url)
    this.path = data.path
    this.bucket = data.bucket
    this.urlType = data.urlType
  })
  .get(function() {
    return S3Helper.getUrl(this)
  })

var s3Storage = mongoose.model('S3Storage', S3StorageSchema) 
module.exports = {
  instance: s3Storage,
  schema: S3StorageSchema
}
