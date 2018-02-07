const async = require('async')
const mongoose = require("mongoose")
const url = require('url')
const Schema = mongoose.Schema
const S3StorageSchema = require('./s3/model').S3StorageSchema
const RawStorageSchema = require('./raw/model').RawStorageSchema


var StorageBaseSchema = new Schema({
},{
  _id: false,
  discriminatorKey: "storageType"
})

var StorageSchema = new Schema({
  storages: [StorageBaseSchema]
}, {_id: false})

StorageSchema.path('storages').discriminator("s3", S3StorageSchema)
StorageSchema.path('storages').discriminator("raw", RawStorageSchema)

StorageSchema.methods.getPutRequest = function() {
  return this.storages[0].getPutRequest.apply(null, arguments)
}

StorageSchema.methods.getGetRequest = function() {
  return this.storages[0].getGetRequest.apply(null, arguments)
}

var Storage = mongoose.model("Storage", StorageSchema)

module.exports = {
  StorageSchema: StorageSchema,
  Storage: Storage,
}
