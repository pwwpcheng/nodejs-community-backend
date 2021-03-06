function checkPermission(req, acl) {
  return function(resource, callback) {
    acl.isAllowed(req.user._id.toString(), req.url, req.method, function(err, result) {
      if(err) {
        return callback(err)
      } else {
        return callback(err, result)
      }
    })
  }
}

function aclMiddleware(acl, controlStrategy) {
  return function (req, res, next) {
    // Uncomment the following line to bypass acl middleware
    return next()
  
    // Uncomment the following line to block all requests
    //return next(new Error("ACL Block in effect. All requests are blocked"))
    async.waterfall([      
      checkPermission(req, acl)
    ], function(err, result) {
      if(err) {return next(err)} 
      return next()
    })
 }
}

module.exports = aclMiddleware  
