const mongoose = require("mongoose")
const Schema = mongoose.Schema
const crypto = require('crypto')
const GeoSchema = require('../geo/model').Schema

const ContentSchema = new Schema({
  contentType: {
    type: String,
    enum: ['text', 'image', 'video', 'mixed', 'other'],
    default: 'mixed'
  },
  text: {
    type: String,
    default: ''
  },
  // media reference a list of Media document IDs
  media: [Schema.Types.ObjectId]
})

const PostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  communityId: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  postTime: {
    type: Date, 
    default: Date.now()
  },
  permissions: {
    blocked_user: [Schema.Types.ObjectId],
    permissionType: {
      type: String,
      default: "public",
      enum: ['public', 'private', 'community'] 
    }
  },
  loc: {
    type:GeoSchema
  },
  content: {
    type: ContentSchema,
    required: true
  }
} , { 
    collection: 'Post'
  }
)

var post = mongoose.model('Post', PostSchema);

module.exports = {
  Post: post
}
