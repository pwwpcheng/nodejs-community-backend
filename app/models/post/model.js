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
}, {_id: false})

var postStatistics = mongoose.model("PostStatistics", PostStatisticsSchema)

var defaultPostStatistics = new postStatistics({
  replayCount: 0,
  viewsCount: 0,
})

const PostGroupSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  addDate: {
    type: Date,
    default: Date.now(),
  },
}, {_id: false})

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
}, {_id: false})

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
  createdAt: {
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
    groupId: this.groupId,
    createdAt: this.createdAt,
    media: this.media,
    statistics: this.statistics,
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
