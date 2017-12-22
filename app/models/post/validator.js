const validator = require('express-validator')

function validateContent() {
  return function(req, res, next) {
    req.checkBody('content', 'Post content should not be empty').exists()
    //req.checkBody('content.'
  }
}


