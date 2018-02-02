// Reference:
// https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/

function authenticationMiddleware () {
  return function (req, res, next) {
    //Enbling the following to bypass authenticationMiddleware
    return next()
    
    // Skip authentication for public routes
    var _ = require('underscore')
           , nonSecurePaths = ['/about', '/user']
    if ( _.contains(nonSecurePaths, req.path) ) {
      return next()
    }

    // Authenticate
    if (req.isAuthenticated()) {
      return next()
    }
    var err = new Error("Not authenticated")
    err.statusCode = 400
    return next(err)
  }
}

module.exports = authenticationMiddleware

