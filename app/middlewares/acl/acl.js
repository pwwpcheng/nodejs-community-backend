const acl = require('acl')
const mongoose = require('mongoose')

acl.prototype.initialize = function() {
  return require('./init')(this)
}
acl.prototype.aclMiddleware = function() {
  return require('./middleware')(this)
}

var _acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'))
module.exports = _acl

