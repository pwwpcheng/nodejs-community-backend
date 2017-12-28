/**
 * Module dependencies.
 */

// TODO(Cheng):
// Move all db operations to helper

const async = require('async')
const mongoose = require('mongoose')
const User = require('./model').User
const userHelper = require('./helper')
const Boom = require('boom')

function arrayFilter(arr) {
  return function(next) {
    arr = arr.filter(x => x !== undefined)
    next(null, arr)
  }
}

function createUser(req, res, next) {
  var create = function() { 
    User.create(req.body, function (err, result) {
      if (err) {
        // Temporarily it's not possible to trigger this error
        // but it's still left here just in case.
        if(err.code === 11000){
          return next(Error('Email or username already exists'))
        }
        return next(err)
      }
      return res.json(result.getPublicFields())
    })
  }

  async.parallel([
    userHelper.checkFieldExists('username', req.body.username),
    userHelper.checkFieldExists('email', req.body.email),
  ], function(err, result) {
    if (err) { next(err) }
    async.waterfall([
      arrayFilter(result),
      function(data, cb) {
        if (data.length === 0) {
          create()
        } else {
          var err = new Error(data.join(', ') + ' already exists.')
          err.statusCode = 403
          next(err)
        }
      }
    ], function(err) {
        next (err)
    })
  })
}

function getUser(req, res, next) {
  async.waterfall([
      userHelper.getUser(null, req.params.username)
    ], function(err, result){
      if(err) { return next(err) }
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

function isFriendCheck(req, res, next) {
  userHelper.isFriend(req.user._id, req.query.b, function(err, result) {
    if (err) { return next(err) }
    return res.json(result)
  }) 
}

module.exports = {
  create: createUser,
  get: getUser,
  update: updateUser,
  delete: deleteUser,
  isFriend: isFriendCheck
}
