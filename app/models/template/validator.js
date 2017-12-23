const validator = require('express-validator')

function validateOperation() {
  return function(req, res, next) {
    next()
  }
}

module.exports = {
  operation: validateOperation
}
