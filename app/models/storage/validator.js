const validator = require('express-validator')

function validateStorage(req, res, next) {
    // Temporarily not implemented.
    var err = req.validationErrors()
    
    if (err) {
      var returnError = err
      returnError.statusCode = 400
      return next(returnError)
    }
    return next()
  }
}

module.exports = {
  storage: validateStorage,
}
