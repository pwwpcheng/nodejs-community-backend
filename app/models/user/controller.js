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
  var query = User.create(req.body, function (err, result) {
    if (err) {
      if(err.code === 11000){
        return next(Error('Email or username already exists'))
      }
      return next(err)
    }
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
  
  User.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, function(err, user) {
    if (err) return next(err)
    if (req.user.username !== req.params.username) {
      var err = new Error("You are only allowed to update your own profile")
      err.statusCode = 400
      return next(err)
    } 
    return res.json(user.getPrivateFields())
  })
}

function deleteUser(req, res, next) {
  User.findOneAndRemove({username: req.params.username})
      .exec(function(err, user) {
        if(err) return next(err)
        if(!user) {
          err = new Error(req.params.username + " does not exist")
          err.statusCode = 404
          return next(err)
        }
        return res.status(204).send()
      })
}

module.exports = {
  create: createUser,
  get: getUser,
  update: updateUser,
  delete: deleteUser
}
