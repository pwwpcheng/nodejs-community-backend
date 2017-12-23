<<<<<<< HEAD



function checkPermission(req, acl) {
  return function(resource, callback) {
=======
function aclMiddleware(acl) {
  return function (req, res, next) {
    // Uncomment the following line to bypass acl middleware
    //return next()
  
    // Uncomment the following line to block all requests
    //return next(new Error("ACL Block in effect. All requests are blocked"))

>>>>>>> 2049861ef2a6deadc874528fafe97ce990f2575f
    acl.isAllowed(req.user._id.toString(), req.url, req.method, function(err, result) {
      if(err) {
        next(err)
      } else {
        console.log(result)
        next(err, result)
      }
    })
  }
}

function aclMiddleware(acl, controlStrategy) {
  return function (req, res, next) {
    // Uncomment the following line to bypass acl middleware
    //return next()
  
    // Uncomment the following line to block all requests
    //return next(new Error("ACL Block in effect. All requests are blocked"))
    async.waterfall([
      
      checkPermission(req, acl)
    ], function(err, result) {
      
    })
 }
}

module.exports = aclMiddleware  
