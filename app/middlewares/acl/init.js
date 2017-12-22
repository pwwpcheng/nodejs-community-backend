module.exports = function (acl) {
  return function(req, res, next) {
    req._acl = acl
    next()
  }
}
  
