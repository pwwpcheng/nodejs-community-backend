const mongoose = require("mongoose")
const Schema = mongoose.Schema
const S3StorageSchema = require('../storage/s3/model').schema

var MediaSchema = new Schema({
  //_id: Schema.Types.ObjectId,
  // mediaType: 'image' / 'text' / 'video'
  creationDate: {
    type: Date,
    default: Date.now()
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
  storageType: {
    type: String,
    enum: ['raw', 's3'],
    required: true
  },
  // s3Path: '/photos/puppy'
  s3Storage: S3StorageSchema,
  rawUrl: String
}, {
  collection: 'Media'
})


MediaSchema
  .virtual('url')
  .set(function(url) {
    if (this.storageType === 'S3') {
      this.S3Storage.set(url)
    } else if (this.storageType === 'raw') {
      this.rawUrl = url
    } else { 
      throw new Error('Unsupported storage type: ' + this.storageType)
    }
  })
  .get(function() {
    if (this.storageType === 's3') {
      return this.s3Storage.url
    } else if (this.storageType === 'raw') {
      return this.rawUrl
    } else { 
      throw new Error('Unsupported storage type: ' + this.storageType)
    }
  })


MediaSchema.methods.getPublicFields = function() {
  var privateObj = {
    id: this._id,
    url: this.url
  }
  return privateObj
}
    

MediaSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
   load: function (options, cb) {
      options.select = options.select
      this.findOne(options.criteria)
        .select(options.select)
        .exec(cb);
    },
    create: function(data, callback) {
        var media = new this(data)
        media.save(callback)
    },
    get: function(id, callback) {
        this.findOne(id, callback)
    }
};

var media = mongoose.model('Media', MediaSchema)
/** export schema */
module.exports = {
    Media: media
}
