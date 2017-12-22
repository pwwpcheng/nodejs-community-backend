const acl = require('acl')
const mongoose = require('mongoose')

acl.prototype.initialize = function() {
  return require('./init')(this)
}
acl.prototype.aclMiddleware = require('./middleware')

var _acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'))
module.exports = _acl

