const curry = require('curry')
const rawModel = require('./model')

var create = curry(function(content, callback) {
  let storage = new rawModel.rawStorage(content)
  return callback(null, storage)
})

module.exports = {
  create: create,
}
