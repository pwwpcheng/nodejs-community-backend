const util = require('util')

//This IAM is only for experimenting on S3 media retrieval

// ----------------------------
// MODIFY FOLLOWING FIELDS BEFORE STARTING SERVER
const S3_IAM_KEY = 'AKIAIOLTULPJNPEXAMPLE'
const S3_IAM_SECRET = 'JorjqkWNE8gV7nBcrNxRVFPRfBWWiYyEXAMPLE'
const S3_BUCKET_NAME = 'object-storage-example'
const S3_BUCKET_REGION = 'us-west-2'
// ----------------------------


// Uncomment next line if using host-style format
S3_URL_FORMAT = 'https://%s.s3.amazonaws.com'

// Uncomment next line if using path-style format
// S3_URL_FORMAT = 'https://s3-%s.amazonaws.com/%s'

// AWS S3 Test key
//const S3_IAM_KEY = 'AKIAIOSFODNN7EXAMPLE'
//const S3_IAM_SECRET = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
//const S3_BUCKET_NAME = 'johnsmith'

module.exports = {
  bucket: S3_BUCKET_NAME,
  region: S3_BUCKET_REGION,
  key: S3_IAM_KEY,
  secret: S3_IAM_SECRET,
  urlFormat: S3_URL_FORMAT, 
  
  // Uncomment next line if using host-style format
  defaultUrl: util.format(S3_URL_FORMAT, S3_BUCKET_NAME)
  
  // Uncomment next line if using path-style format
  //defaultUrl: util.format(S3_URL_FORMAT, S3_BUCKET_REGION, S3_BUCKET_NAME)
}

