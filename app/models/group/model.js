const mongoose = require("mongoose")
const Schema = mongoose.Schema
const GeoSchema = require('../geo/model').GeoSchema
const MediaSchema = require('../media/model').MediaSchema
//const defaultMedia = require('../media/model').defaultMedia

var GroupStatisticsSchema = new Schema({
  postCount: Number,
  hot: Number,
  hotOneHour: Number,
}, {_id: false})

var GroupSchema = new Schema({
  groupname: {
    type: String,
    minlength: 6,
    unique: true,
    required: true,
  },
  alias: {
    type: String,
  },
  description: {
    type: String,
    default: 'Our group',
  },
  groupImage: {
    // Points to a Media document
    type: Schema.Types.ObjectId,
    //default: defaultMedia,
  },
  location: {
    type: GeoSchema,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  creator: {
    // creator -> User._id
    type: Schema.Types.ObjectId,
    required: true,
  },
  bannedUsers: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  permissions: {
    groupType: {
      type: String,
      enum: ['public', 'protected', 'private'],
      default: 'public',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPostBanned: {
      type: Boolean,  
      default: false,
    },
    allowJoin: {
      type: Boolean,
      default: true,
    },
  },
  statistics: {
    type: GroupStatisticsSchema,
  }, 
}, {
  collection: 'Group',
})

GroupSchema.methods.getPublicFields = function() {
  var publicObj = {
    _id: this._id,
    groupname: this.groupname,
    alias: this.alias,
    location: this.location.getPublicFields(),
    statistics: this.statistics,
    description: this.description,
    groupImage: this.groupImage,
  }
  return publicObj
}

GroupSchema.methods.getProtectedFields = function() {
  var protectedObj = {
    _id: this._id,
    groupname: this.groupname,
    alias: this.alias,
    description: this.description,
    groupImage: this.groupImage,
    location: this.location.getPublicFields(),
    statistics: this.statistics,
    creationDate: this.creationDate,
    creator: this.creator,
    posts: this.posts,
  }
  return protectedObj
}

var group = mongoose.model('Group' , GroupSchema)

module.exports = {
  Group: group,
  GroupSchema: GroupSchema,
}
