const mongoose = require("mongoose")
const Schema = mongoose.Schema
const LocationSchema = require('../geo/model').GeoSchema

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
  }
}, {
  collection: 'Group',
})

GroupSchema.methods.getProtectedFields = function() {
  var protectedObj = {
    groupname: this.groupname,
    creationDate: this.creationDate
  }
  return protectedObj
}

var group = mongoose.model('Group' , GroupSchema)

module.exports = {
  Group: group,
  GroupSchema: GroupSchema,
}
