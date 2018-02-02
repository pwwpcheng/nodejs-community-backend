const async = require('async')
const curry = require('curry')
const S3Config = require('../../config/S3')

// Reference: AWS Documentation - S3 - Signing and Authenticating REST Requests
// http://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html
// stringToSign: Corresponds to StringToSign
//      example: /photos/puppy.jpg
// header: (Object) 
//                  This value is temporarily not taken.
// callback: function(err, data){}
function calculateSignatureBase(data, callback) {
  try{
    data.S3Signature = crypto
                    .createHmac('sha1', Buffer.from(S3Config.secret, 'utf8'))
                    .update(Buffer.from(data.stringToSign, 'utf-8'))
                    .digest('base64')
  }catch( err ) {
    err.message = "Failed to calculate S3 Signature. " + err.message
    throw err
  }
  callback(null, data)
}

var calculateSignature = curry(calculateSignatureBase)

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
// callback: function(err, data){}
function prepareData(data) {
  return function(callback) {
    data.date = data.date ? data.date : new Date()
    data.stringToSign = (data.method ? data.method.toUpperCase() : 'GET') + '\n' +
                       (data.contentMD5 ? data.contentMD5 : '')           + '\n' + 
                       (data.contentType ? data.contenType : '')          + '\n' + 
                        data.date.toUTCString()                           + '\n' + 
                       (data.S3bucket ? '/' + data.S3bucket + data.path : '/' + S3Config.bucket + data.path)
    callback(null, data)
  }
}

// Entry point.
// data: (Object) Preferrably S3Storage instance.
// callback: (Function) function(err, signedRequest)
function sign(data, callback) {
  if (!data.path || !data.method) {
    return callback(new Error("path and method must be provided for signing."))
  }
  async.waterfall([
    prepareData(data),
    calculateSignature
  ], function (err, data) {
    if (err) {
      callback(err)
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
      callback(null, data)
    }
  })
}

module.exports = sign  
