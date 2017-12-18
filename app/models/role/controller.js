/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
const Role = require('./model').Role

function updateRole(req, res, next) {
  Role.findOneAndUpdate({name: req.params.name}, req.body, {new: true}, function(err, role) {
    if (err) return next(err)
    return res.json(role)
  })
}

function deleteRole(req, res, next) {
  User.findOneAndRemove({name: req.params.name})
      .exec(function(err, role) {
        if(err) return next(err)
        if(!role) {
          err = new Error(req.params.name + " does not exist")
          err.statusCode = 404
          return next(err)
        }
        return res.status(204).send()
      })
}

module.exports = {
  //create: createRole,
  //get: getRole,
  update: updateRole,
  delete: deleteRole
}
