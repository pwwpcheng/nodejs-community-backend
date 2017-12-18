const S3Config = require('../../config/S3')
const async = require('async')

// Reference: AWS Documentation - S3 - Signing and Authenticating REST Requests
// http://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html
// stringToSign: Corresponds to StringToSign
//      example: /photos/puppy.jpg
// header: (Object) 
//                  This value is temporarily not taken.
// next: function(err, data){}
function calculateSignature(data, next) {
    try{
      data.S3Signature = crypto
                      .createHmac('sha1', Buffer.from(S3Config.secret, 'utf8'))
                      .update(Buffer.from(data.stringToSign, 'utf-8'))
                      .digest('base64')
    }catch( err ) {
      err.message = "Failed to calculate S3 Signature. " + err.message
      throw err
    }
    next(null, data)
}

// Prepare date, headers and stringToSign according to S3 standards
// data: (Object) { 
//   path: (string) S3 path without bucket name (virtual hosted-style url)
//        example: /photos/puppy.jpg
//   method: (String) Http method
//        example: "GET"
//   header: (Object) Corresponds to CanonicalizedAmzHeaders, 
//                  This value is temporarily not taken.
//        example: {""}
// }
// next: function(err, data){}
function prepareData(data, next) {
  return function(next) {
    data.date = data.date ? data.date : new Date()
    data.stringToSign = (data.method ? data.method.toUpperCase() : 'GET') + '\n' +
                       (data.contentMD5 ? data.contentMD5 : '')           + '\n' + 
                       (data.contentType ? data.contenType : '')          + '\n' + 
                        data.date.toUTCString()                           + '\n' + 
                       (data.S3bucket ? '/' + data.S3bucket + data.path : '/' + S3Config.bucket + data.path)
    next(null, data)
  }
}

function sign(data, next) {
  if (!data.path || !data.method) {
    return next(new Error("path and method must be provided for signing."))
  }
  async.waterfall([
    prepareData(data),
    calculateSignature
  ], function (err, data) {
    if (err) {
      next(err)
    } else {
      if (data.header) {
        data.header.Authentication = 'AWS ' + S3Config.key + ':' + data.S3Signature
        data.header.Date = data.date.toUTCString()
      } else {
        data.header = { 
          Authentication : 'AWS ' + S3Config.key + ':' + data.S3Signature,  
          Date : data.date.toUTCString()
        }
      }
      data.S3Url = util.format(S3Config.urlFormat, data.S3Bucket || S3Config.bucket) + data.path
      next(null, data)
    }
  })
}

module.exports = sign  
