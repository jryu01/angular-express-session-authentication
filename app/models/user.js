/**
 * app/models/user.js
 * user model
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

/**
 * User Schema
 *
 */
var UserSchema = new Schema({

  local: {
    email: String,
    password: { type: String, select: false }, 
  },

  facebook: {
    id: String,
    name: String,
    email: String,
    acessToken: { type: String, select: false }
  } 
}); 

/**
 * Pre-save hook for password validation and hashing
 */
UserSchema.pre('save', function(next){ 
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('local.password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.local.password, salt, function(err, hash) {
      if (err) return next(err);
 
      // override the cleartext password with the hashed one
      user.local.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.
  compare(candidatePassword, this.local.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};
UserSchema.methods.getSafeJSON = function () {

  var user = this.toObject();

  user.id = user._id;

  delete user._id;
  delete user.__v;
  if (user.local && user.local.password) {
    delete user.local.password;
  }
  if (user.facebook && user.facebook.accessToken) {
    delete user.facebook.accessToken;
  }
  return user;
};

module.exports = mongoose.model('User', UserSchema);