// validator.js
// Validates requests (especially posts and puts), check
// if all parameters are valid and obey rules declared in
// database schema (model.js).
//
// Currently the project is using express-validator. 
// Reference:
// https://github.com/ctavan/express-validator

const validator = require('express-validator')

function validateOperation() {
  return function(req, res, next) {
    next()
  }
}

module.exports = {
  operation: validateOperation
}
