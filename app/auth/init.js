const passport = require('passport')
const User = require('../model/user/model').User
const localStrategy = require('./strategy/local-strategy')
const authMiddleware = require('./middleware')

passport.serializeUser(function(user, done) {
  console.log("user_id: " + user.id)
  done(null, user.id);
})

passport.deserializeUser(function(id, done) {
  User.findOne({_id: id}, function(err, user) {
      done(err, user);
  })
})

function initPassport(app) {
  passport.use(localStrategy)
  passport.authenticationMiddleware = authMiddleware
}

module.exports = initPassport;
