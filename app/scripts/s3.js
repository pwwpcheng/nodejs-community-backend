const S3Config = require('../config/s3')

function init() {
  process.env.AWS_ACCESS_KEY_ID = S3Config.key
  process.env.AWS_SECRET_ACCESS_KEY = S3Config.secret
}

module.exports = {
  init: init
}
