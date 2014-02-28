/**
 * user model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

/**
 * User Schema
 *
 */
var UserSchema = new Schema({
	name: String, 
	email: String,
	password: {type: String, select: false}, 
	providers: [],
	facebook: {}
});	

/**
 * Pre-save hook for password validation and hashing
 */
UserSchema.pre('save', function(next){ 
  var user = this;
	var isPwdExist = user.password && user.password.length;

  //Check if neither password or provider is provided
  if(user.isNew) {
    if (!isPwdExist && !(user.providers)) {
      return next(new Error('Invalid password'));
    }
  }
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
 
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};
module.exports = mongoose.model('User', UserSchema);
