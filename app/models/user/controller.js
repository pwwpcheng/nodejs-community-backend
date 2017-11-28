/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
const User = require('./model').User
const Boom = require('boom')


/**
 * Create user
 */

function createUser(req, res, next) {
  console.log(0)
  var query = User.create(req.body, function (err, result) {
    if (err) {
      if(err.code === 11000){
        return next(Error('Email or username already exists'))
      }
      return next(err)
    }
    console.log(2)
    return res.json(result.getPublicFields())
  })
};

function getUser(req, res, next) {
  User.findOne({username: req.params.username}, function(err, result) {
      if (err) return next(err)
      if (!result) {
        var e = new Error("User does not exist")
        e.statusCode = 404
        return next(e)
      }
      return res.json(result.getPublicFields())
    }
  )
}

function updateUser(req, res, next) {
  User.findOne({username: req.params.username}, function(err, user) {
    if (err) return next(err)
    return res.json(user)
  })
}

function deleteUser(req, res, next) {
  User.remove({username: req.params.username}, function(err) {
    if(err) return next(err)
  })
}

module.exports = {
  create: createUser,
  get: getUser,
  update: updateUser,
  delete: deleteUser
}
