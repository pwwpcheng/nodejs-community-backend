const mongoose = require("mongoose")
const Schema = mongoose.Schema
const crypto = require('crypto')

var MemberSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['member', 'editor', 'admin', 'blocked'],
    required: true,
  },
  joinDate: {
    type: Date,
  },
  posts: {
    type: [Schema.Types.ObjectId],
    default: [],
  }
})

var FriendSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    //required: true
  },
  friendGroup: {
    type: [Schema.Types.ObjectId],
    default: [],
  }
})

var UserPreferenceSchema = new Schema({
  permission: {
    type: String,
    enum: ['public', 'private', 'community'],
    default: 'public',
  }
})

var UserSchema = new Schema({
  username: { 
    type: String, 
    minlength: 5, 
    maxlength: 30, 
    required: true,
    unique: true,
  },
  sha256Password: { 
    type: String,
    //required: true,
  },
  email: { 
    type: String,
    required: true,
    match: /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/,
    unique: true,
  },
  registerDate: {
    type: Number,
    default: Date.now,
  },
  name: { 
    type: String,
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
  }, 
  region: { 
    type: String, 
    default: "United States" ,
  },
  city: { 
    type: String,
  },
  phone: { 
    type: String,
  },
  salt: { 
    type: String, 
    default: '',
  },
  banned: {
    type: Boolean,
    default: false,
  },
  friends: {
    type: [FriendSchema], 
  },

  // Here's a trade-off between modularity and efficiency.
  // Model directly related to group (Member) is introduced into 
  // user model, increasing coupling. This is because a group might
  // have more than 10^5 people, and adding/deleting/querying 
  // members will severely damage query speed and efficiency.
  // Thus we hereby put logics for join group into user model,
  // and limit the number of groups a user can join.

  // Querying all users in a community should reference
  // https://docs.mongodb.com/manual/core/index-multikey/#multikey-embedded-documents

  joinedGroups: {
    type: [MemberSchema],
    default: [],
  }
}, {collection: 'User'})

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.sha256Password = this.encryptPassword(password)
  })
  .get(function() { return this.sha256Password })


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
    return this.encryptPassword(plainText) === this.sha256Password;
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
      throw err
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
        .exec(cb)
    },
    create: function(data, callback) {
        var user = new this(data)
        user.save(callback)
    },
    get: function(id, callback) {
        this.findOne(id, callback)
    }
};

UserSchema.methods.getUserModifiableFields = function() {
  return {
    email: true,
    name: true,
    age: true,
    city: true,
    phone: true
  }
}

UserSchema.methods.getPublicFields = function() {
  var publicObj = {
    username: this.username,
    registerDate: this.registerDate
  }
  return publicObj
}


UserSchema.methods.getPrivateFields = function() {
  var privateObj = {
    username: this.username,
    email: this.email,
    name: this.name,
    age: this.age,
    city: this.city,
    phone: this.phone,
    registerDate: this.registerDate
  }
  return privateObj
}

var user = mongoose.model('User', UserSchema)
var friend = mongoose.model('Friend', FriendSchema)

/** export schema */
module.exports = {
    User: user,
    UserSchema: UserSchema,
    Friend: friend,
    FriendSchema: FriendSchema,
}
