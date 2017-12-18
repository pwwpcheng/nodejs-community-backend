const S3Config = require('../../config/s3')
const async = require('async')
const util = require('util')


// NOTE(Cheng): All functions here are async unless noted!
// Normally it wouldn't block the program so I leave it as async. 

// pathStyleUrlRegex will match:
// https://s3-us-west-2.amazonaws.com/johnsmith/photos/puppy.jpg
//  -> region: us-west-2   -> bucket: johnsmith   -> path: /photos/puppy.jpg
// https://s3.amazonaws.com/johnsmith/photos/puppy.jpg
//  -> bucket: johnsmith   -> path: /photos/puppy.jpg
var pathStyleUrlRegex = /^https{0,1}:\/\/s3(-([a-z0-9\-]*)){0,1}.amazonaws.com\/([a-zA-Z\_\-]+)\/(.+)$/

// hostStyleUrlRegex will match:
// https://spotlite-object-storage.s3.amazonaws.com/test.txt
//  -> bucket: spotlite-object-storage     -> path: /test.txt
var hostStyleUrlRegex = /^https{0,1}:\/\/([a-zA-Z\_\-]+).s3.amazonaws.com(.+)$/

function getS3Url(data) {
  if (!data.path) { throw new Error('"path" should be provided.') }
  var res = util.format( S3Config.urlFormat, 
                         data.bucket ? data.bucket : S3Config.bucket 
                       ) + data.path
  return res
}

function getS3UrlType(url) {
  if (pathStyleUrlRegex.test(url)) {
    return 'path-style'
  } else if (hostStyleUrlRegex.test(url)) {
    return 'host-style'
  } else {
    return null
  }
}

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
      

module.exports = {
  getUrl: getS3Url,
  extractFromUrl: extractS3Data
} 
