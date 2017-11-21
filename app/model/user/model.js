const mongoose = require("mongoose")
const Schema = mongoose.Schema
const crypto = require('crypto')

var UserSchema = new Schema({
  username: { 
    type: String, 
    minlength: 5, 
    maxlength: 30, 
    required: true,
    unique: true
  },
  sha256_password: { 
    type: String
    //required: true
  },
  email: { 
    type: String,
    required: true,
    match: /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/,
    unique: true
  },
  registerDate: {
    type: Number,
    default: Date.now
  },
  name: { 
    type: String 
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  }, 
  region: { 
    type: String, 
    default: "United States" 
  },
  city: { 
    type: String 
  },
  phone: { 
    type: String 
  },
  salt: { 
    type: String, 
    default: '' 
  }
}, {collection: 'User'})

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.sha256_password = this.encryptPassword(password)
  })
  .get(function() { return this.sha256_password })


// The following methods are based on a Medium article about passport auth
// https://medium.com/@pandeysoni/user-authentication-using-passport-js-in-node-js-ed1e23e5cc36
// Author: Soni Pandey  
// Github: pandeysoni

UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.sha256_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password){
      return ''
    }
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(password.toString())
        .digest('hex')
    } catch (err) {
      console.log(err)
      return ''
    }
  },
};

UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
   load: function (options, cb) {
      options.select = options.select
      this.findOne(options.criteria)
        .select(options.select)
        .exec(cb);
    },
    create: function(data, callback) {
        var user = new this(data)
        user.save(callback)
    },
    get: function(id, callback) {
        this.findOne(id, callback)
    }
};

var user = mongoose.model('User', UserSchema)
/** export schema */
module.exports = {
    User: user
}
