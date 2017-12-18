const mongoose = require("mongoose")
const Schema = mongoose.Schema

var RoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  creationDate: {
    type: Date,
    default: Date.now
  },
  lastModificationDate: {
    type: Date,
  },
  rules:[{
    name: {
      type: String,
      required: true
    },
    expireDate: Date
  }]
}, {collection: 'Role'})


RoleSchema.methods.getPrivateFields = function() {
  var privateObj = {
    name: this.name,
    creationDate: this.creationDate
  }
  return privateObj
}

var role = mongoose.model('Role', RoleSchema)
/** export schema */
module.exports = {
    Role: role
}
