/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
const Media = require('./model').Media
const Boom = require('boom')


// Need modification
function createMedia(req, res, next) {
  var query = Media.create(req.body, function (err, result) {
    if (err) {
      if(err.code === 11000){
        return next(Error('Email or username already exists'))
      }
      return next(err)
    }
    return res.json(result.getPublicFields())
  })
};

function getMedia(req, res, next) {
  Media.findById(req.params.mediaId, function(err, result) {
    if (err) return next(err)
    if (!result) {
      var e = new Error("Media does not exist. Id: " + mediaId)
      e.statusCode = 404
      return next(e)
    }
    return res.json(result.getPublicFields())
  })
}

// Need modification
function updateMedia(req, res, next) {
  Media.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, function(err, user) {
    if (err) return next(err)
    if (req.user.username !== req.params.username) {
      var err = new Error("You are only allowed to update your own profile")
      err.statusCode = 400
      return next(err)
    } 
    return res.json(user.getPrivateFields())
  })
}

// Need modification
function deleteMedia(req, res, next) {
  Media.findOneAndRemove({_id: req.params.mediaId})
      .exec(function(err, media) {
        if(err) return next(err)
        if(!media) {
          err = new Error(req.params.mediaId + " does not exist")
          err.statusCode = 404
          return next(err)
        }
        return res.status(204).send()
      })
}

module.exports = {
//  create: createMedia,
  get: getMedia,
//  update: updateMedia,
  delete: deleteMedia
}
