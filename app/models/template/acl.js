const acl = require('../../middlewares/acl/')

function aclMiddleware(){
  return function(req, res, next) {
    next()
  }
}

module.exports = {
  aclMiddleware : aclMiddleware
}
