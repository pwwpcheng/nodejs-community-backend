const validator = require('express-validator')

function validateGeo(req, res, next) {
  req.sanitize(['location.longitude', 'location.latitude', 'location.radius']).toFloat()

  req.checkBody("location", "location information should be provided").exists()
  req.checkBody("location.longitude", "longitude must be a float between -180.0 to 180.0").isFloat({min: -180, max: 180})
  req.checkBody("location.latitude", "latitude must be a float between -180.0 to 180.0").isFloat({min: -180, max: 180})
  req.checkBody("location.radius", "radius must be a positive number").isFloat({min: 0, max: 1000})
  var err = req.validationErrors()
  
  if (err) {
    var returnError = err
    returnError.statusCode = 400
    return next(returnError)
  }
  return next()
}

module.exports = {
  geo: validateGeo,
}
