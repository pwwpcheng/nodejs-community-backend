const mongoose = require("mongoose")
const Schema = mongoose.Schema
const GeoSchema = require('../geo/model').GeoSchema
const MediaSchema = require('../media/model').MediaSchema
//const defaultMedia = require('../media/model').defaultMedia

var GroupPostSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  addDate: {
    type: Date,
    required: true,
  }
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
  profileImage: {
    type: MediaSchema,
    //default: defaultMedia,
  },
  creationDate: {
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
  },
  //posts: [GroupPostSchema],
  
}, {
  collection: 'Group',
})

GroupSchema.methods.getPublicFields = function() {
  var publicObj = {
    _id: this._id,
    groupname: this.groupname,
    alias: this.alias,
    description: this.description,
    profileImage: this.profileImage,
  }
  return publicObj
}

GroupSchema.methods.getProtectedFields = function() {
  var protectedObj = {
    _id: this._id,
    groupname: this.groupname,
    alias: this.alias,
    description: this.description,
    profileImage: this.profileImage,
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
