const mongoose = require("mongoose")
const Schema = mongoose.Schema
const crypto = require('crypto')

const PostSchema = new Schema({
  userId: {
    type: String
  },
  postTime: {
    type: Datetime, 
    default: time.now()
  },
  permissions: {
    blocked_user: [{type: String}],
    permissionType: {
      type: String,
      default: "public",
      enum: PermissionTypeArray
    }
  }
  content: {
    contentType: {
      type: String
    },
    required: true
  }
}, {
  collection: 'Post',
}

var post = mongoose.model('Post', PostSchema);

module.exports = {
  Post: post
}
