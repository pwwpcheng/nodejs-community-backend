//const _acl = require('./acl')
//console.log(_acl)

function aclMiddleware() {
  return function (req, res, next) {
    // Uncomment the following line to bypass acl middleware
    //return next()
  
    // Uncomment the following line to block all requests
    //return next(new Error("ACL Block in effect. All requests are blocked"))

    var acl = req._acl
    acl.isAllowed(req.user._id.toString(), req.url, req.method, function(err, result) {
      if(err) {
        next(err)
      } else {
        console.log(result)
        next()
      }
    })
  }
}

module.exports = aclMiddleware  
