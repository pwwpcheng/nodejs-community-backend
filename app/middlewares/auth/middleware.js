// Reference:
// https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/

function authenticationMiddleware () {
  return function (req, res, next) {
    //return next()
    // Skip authentication for public routes
    var _ = require('underscore')
           , nonSecurePaths = ['/', '/about', '/contact', '/login', '/user'];
    if ( _.contains(nonSecurePaths, req.path) ) {
      return next()
    }

    // Authenticate
    if (req.isAuthenticated()) {
      return next()
    }
    res.json({"error": "not authenticated"})
  }
}

module.exports = authenticationMiddleware

