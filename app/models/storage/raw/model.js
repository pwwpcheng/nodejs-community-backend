const mongoose = require('mongoose')
const url = require('url')
const Schema = mongoose.Schema

var RawStorageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
})

RawStorageSchema
  .virtual('request')
  .get(function() {
    var parsedUrl = url.parse(this.url)
    var request = {
      method: "GET",
      host: parsedUrl.host,
      path: parsedUrl.path,
    }
    return request
  })

var rawStorage = mongoose.model("RawStorage", RawStorageSchema)

module.exports = {
  RawStorage: rawStorage,
  RawStorageSchema: RawStorageSchema
}
