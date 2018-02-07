const async = require('async')
const aws4 = require('aws4')
const crypto = require('crypto')
const curry = require('curry')
const util = require('util')

//const S3Model = require('./model')
const S3Config = require('../../../config/s3')
const Storage = require('../model').Storage

// pathStyleUrlRegex will match:
// https://s3-us-west-2.amazonaws.com/johnsmith/photos/puppy.jpg
//  -> region: us-west-2   -> bucket: johnsmith   -> path: /photos/puppy.jpg
// https://s3.amazonaws.com/johnsmith/photos/puppy.jpg
//  -> bucket: johnsmith   -> path: /photos/puppy.jpg
var pathStyleUrlRegex = /^https{0,1}:\/\/s3(-([a-z0-9\-]*)){0,1}.amazonaws.com\/([a-zA-Z\_\-]+)\/(.+)$/

// hostStyleUrlRegex will matchl
// https://spotlite-object-storage.s3.amazonaws.com/test.txt
//  -> bucket: spotlite-object-storage     -> path: /test.txt
var hostStyleUrlRegex = /^https{0,1}:\/\/([a-zA-Z\_\-]+).s3.amazonaws.com(.+)$/

// This is not a sync function and currently not used by any 
// other function. It is used for extracting S3 bucket and 
// path from an S3 url. Normally it would not block the thread
// but be cautious if using it.
function extractS3Data(url) {
  var urlType = getS3UrlType(url)
  if (!urlType) { throw new Error('Given url "' + url + '" is not a valid S3 Url') }
  if (urlType === 'path-style') {
    var matchResult = pathStyleUrlRegex.exec(url)
    return {
      urlType: 'path-style',
      region: matchResult[2],
      bucket: matchResult[3],
      path: matchResult[4]
    }
  } else if (urlType === 'host-style') {
    var matchResult = hostStyleUrlRegex.exec(url)
    return {
      urlType: 'host-style',
      bucket: matchResult[1],
      path: matchResult[2]
    }
  } else {
    throw new Error('Unsupported s3 url "' + url + '"')
  }
}

function signRequest(opt, cb) {
  try {
    var signedOpt = aws4.sign(opt)
    return cb(null, signedOpt)
  }
  catch (err) {
    return cb(err)
  }
}

var create = curry(function (content, callback) {
  let getPath = function(cb) {
    if (content.path) {
      var path = content.path 
    } else {
      // generate random path
      let randomHash = crypto.createHash('sha1').update(new Date().valueOf().toString()).digest('hex')
      let folder = S3Config.userPathPrefix + randomHash.slice(0, 2) + '/'
      let filename = randomHash.slice(2, 12) + Date.now().toString()
      var path = folder + filename
    }
    return cb(null, path)
  }

  let makeContent = function(path, cb) {
    content.path = path
    content.storageType = 's3'
    return cb(null, content)
  }

  let createDocument = function(content, cb) {
    try {
      var storage = new Storage({storages: [content]})
      return cb(null, storage)
    } catch(err) {
      err.statusCode = 500
      return cb(err)
    }
  }

  async.waterfall([
    getPath,
    makeContent,
    createDocument
  ], function(err, res) {
    if(err) { return callback(err) }
    return callback(null, res)
  })
})

function getPutRequest(storageDocument, callback) {
  let createOpt = function(cb) {
     let d = new Date()
     let opt = {
      service: 's3',
      region: S3Config.region,
      method: 'PUT',
      path: storageDocument.path,
      host: storageDocument.host,
      headers: {
        'X-Amz-Date': d.toUTCString(),
      }
    }
    return cb(null, opt)
  }

  let mergeData = function(opt, cb) {
    for (var k in storageDocument.meta) {
      opt.header['X-Amz-Metadata-' + k] = data[k]
    }
    return cb(null, opt)
  }
  
  async.waterfall([
    createOpt,
    mergeData,
    signRequest
  ], function(err, result) {
    if(err) {
      return callback(err)
    }
    return callback(null, result)
  })
}

function getGetRequest(storageDocument, callback) {
  let createOpt = function(cb) {
     let opt = {
      service: 's3',
      region: S3Config.region,
      method: 'GET',
      path: storageDocument.path,
      host: storageDocument.host,
      headers: {
        'X-Amz-Date': Date.now().toUTCString(),
      }
    }
    return cb(null, opt)
  }
  
  async.waterfall([
    createOpt,
    signRequest
  ], function(err, result) {
    if(err) {
      return callback(err)
    }
    return callback(null, result)
  })
 
}

module.exports = {
  create: create,
  getPutRequest: getPutRequest,
  getGetRequest: getGetRequest,
} 
