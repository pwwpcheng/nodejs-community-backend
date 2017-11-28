const passport = require('passport')

exports.test = function(req, res) {
  res.json({"test": "success"})
}

exports.logout = function (req, res) {
  req.logout()
  req.session.destroy()
  return res.json(req.user)
}

exports.authenticate = function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }
    //if (!user) { return res.json({ "message" : "Authentication failed."}) }
    if (!user) { return next(new Error('Authentication failed')) }
    req.login(user, err, function(err) {
      if(err) { return next(err) }
      return res.json(user.getPrivateFields())
    })
  })(req, res, next);
}
