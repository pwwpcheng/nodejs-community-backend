const mongoose = require("mongoose")
const Schema = mongoose.Schema

var GeoSchema = new Schema({
  type: {
    type: String
  },
  coordinates: []
})

module.exports = {
  Schema : GeoSchema
}
