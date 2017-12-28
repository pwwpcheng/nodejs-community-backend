const mongoose = require("mongoose")
const Schema = mongoose.Schema
const crypto = require('crypto')
const GeoSchema = require('../geo/model').GeoSchema

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
    blockedUser: {
      type: [Schema.Types.ObjectId],
      default: []
    },
    permissionType: {
      type: String,
      default: "publicPost",
      enum: ['publicPost', 'privatePost', 'communityPost', 'friendPost'] 
    },
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

PostSchema.methods.getPublicFields = function() {
  var returnObj = {
    content: this.content,
    userId: this.userId,
    conmmunityId: this.communityId,
    postTime: this.postTime
  }
  if(this.loc) {
    returnObj['loc'] = this.loc
  }
  return returnObj
}

var post = mongoose.model('Post', PostSchema);

module.exports = {
  Post: post
}
