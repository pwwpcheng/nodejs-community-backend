/**
 * Module dependencies.
 */
const LocalStrategy = require('passport-local').Strategy
const User = require('../../model/user/model').User

/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    var options = {
      criteria: { username: username },
      select: 'name email sha256_password salt'
    }
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        console.log("unknown user")
        return done(null, false, { message: 'Unknown user' })
      }
      if (!user.authenticate(password)) {
        console.log("invalid user")
        return done(null, false, { message: 'Invalid password' })
      }
      console.log("success")
      return done(null, user)
    })
  }
);
