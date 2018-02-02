const mongoose = require("mongoose")
const Schema = mongoose.Schema
const crypto = require('crypto')
const GeoSchema = require('../geo/model').GeoSchema

const PostStatisticsSchema = new Schema({
  replayCount: {
    type: Number,
    default: 0,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
})

var postStatistics = mongoose.model("PostStatistics", PostStatisticsSchema)

var defaultPostStatistics = new postStatistics({
  replayCount: 0,
  viewsCount: 0,
})

const PostGroupSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: {
      unique: true,
    },
  },
  addDate: {
    type: Date,
    default: Date.now(),
  },
})

var postGroup = mongoose.model("PostGroup", PostGroupSchema)

const PostContentSchema = new Schema({
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

var postContent = mongoose.model("PostContent", PostContentSchema)

const PostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  groups: {
    type: [PostGroupSchema],
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
    type: PostContentSchema,
    required: true
  },
  statistics: {
    type: PostStatisticsSchema,
    default: defaultPostStatistics,
  },
} , { 
    collection: 'Post'
  }
)

PostSchema.methods.getPublicFields = function() {
  var returnObj = {
    content: this.content,
    userId: this.userId,
    conmmunityId: this.communityId,
    postTime: this.postTime,
    media: this.media,
  }
  if(this.loc) {
    returnObj['loc'] = this.loc
  }
  return returnObj
}

var post = mongoose.model('Post', PostSchema);

module.exports = {
  Post: post,
  PostSchema: PostSchema,
  PostStatistics: postStatistics,
  PostStatisticsSchema: PostStatisticsSchema,
  PostContent: postContent,
  PostContentSchema: PostContentSchema,
  PostGroup: postGroup,
  PostGroupSchema: PostGroupSchema,
}
