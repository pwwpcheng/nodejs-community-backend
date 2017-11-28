/**
 * Module dependencies.
 */
const LocalStrategy = require('passport-local').Strategy
const User = require('../../../models/user/model').User

/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    var options = {
      criteria: { username: username }
    }
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' })
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' })
      }
      return done(null, user)
    })
  }
);
