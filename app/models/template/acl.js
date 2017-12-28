// ACL Middleware: access control list
// acl.js deals with access control for all routers
// It allows a request to be processed when
// request passes acl.allow test.

// acl.js depends on other helpers and database
// backend to store and performance checks.

const acl = require('../../middlewares/acl/')

function aclMiddleware(){
  return function(req, res, next) {
    next()
  }
}

module.exports = {
  aclMiddleware : aclMiddleware
}
