const mongoose = require("mongoose")
const Schema = mongoose.Schema

var GeoSchema = new Schema({
  type: {
    type: String
  },
  coordinates: {
    type: [Number],
    index: '2d',
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
}, {
  _id: false
})

GeoSchema.methods.getPublicFields = function() {
  var publicObj = {
    longitude: this.coordinates[0],
    latitude: this.coordinates[1],
    radius: this.radius,
  }
  return publicObj
}

var geo = mongoose.model("Geo", GeoSchema)

module.exports = {
  Geo: geo,
  GeoSchema : GeoSchema
}
