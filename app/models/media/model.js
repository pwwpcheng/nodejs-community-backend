const mongoose = require("mongoose")
const Schema = mongoose.Schema
const StorageSchema = require('../storage/model').StorageSchema
//const S3DefaultImage = require('../storage/s3/model').S3DefaultImage

var MediaSchema = new Schema({
  //_id: Schema.Types.ObjectId,
  // mediaType: 'image' / 'text' / 'video'
  creationDate: {
    type: Date,
    default: Date.now()
  },
  userId: {
    type: Schema.Types.ObjectId,
    //required: true,
  },
  // isValid: specific for S3 Storages, indicates whether 
  // object of current document have been successfully
  // stored in S3 bucket.
  // 
  // When an object is to be stored in S3, our backend
  // first creates a Media document, with isValid set as 
  // false. It then returns a signed request to user and allow
  // user to update selected object to S3. After the object 
  // is successfully uploaded to S3, user sends a request to 
  // our backend, and we mark this field as 'true'.
  isValid: {
    type: Boolean,
    default: false
  },
  mediaType: {
    type: String,
    enum: ['image', 'text', 'video', 'other'],
    default: 'other'
  },
  contentType: {
    type: String,
    default: 'application/octet-stream'
  },
  //storageType: {
  //  type: String,
  //  enum: ['raw', 's3'],
  //  required: true
  // },
  // Storage must be one of the instances of:
  // [RawStorage, S3Storage]
  storage: {
    type: StorageSchema,
    required: true,
  },
}, {
  collection: 'Media'
})


MediaSchema
  .virtual('request')
  .get(function() {
    return this.storage.request
  })

MediaSchema.methods.getPublicFields = function() {
  let t = this
  let publicObj = {
    id: t._id,
    request: t.storage.getGetRequest()
  }
  return publicObj
}

    
var Media = mongoose.model('Media', MediaSchema)
/*var defaultMedia = new Media({
  mediaType: "image",
  contentType: "image/png",
  storageType: "s3",
  storage: S3DefaultImage,
})*/

/** export schema */
module.exports = {
  MediaSchema: MediaSchema,
  Media: Media,
  //defaultMedia: defaultMedia,
}
