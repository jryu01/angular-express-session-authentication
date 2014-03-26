/*
* app/controllers/auth.js
*/

'use strict';

var passport = require('passport'),
    User = require('../models/user');

// authentication controller functions 

var facebookAuth = passport.authenticate('facebook', { scope : 'email' });
var facebookCallback = passport.authenticate('facebook', { 
  successRedirect : '/',
  failureRedirect : '/'
});

function signin(req, res, next) {
  // passport.authenticate('local-signin', function (err, user, info) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.session.message = [info.message];
      return res.send(401, { success: false, info: info });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      user = user.toObject();
      delete user.password;
      return res.send(user);
    });
  })(req, res, next);
}

function signup(req, res, next) {
  // passport.authenticate('local-signup', function (err, user, info) {
  // passport.authenticate('local', function (err, user, info) {
  //   if (err) { return next(err); }
  //   if (!user) {
  //     req.session.message = [info.message];
  //     return res.send(401, { sucess: false, info: info});
  //   }
  //   req.logIn(user, function(err) {
  //     if (err) { return next(err); }
  //     user = user.toObject();
  //     delete user.password;
  //     return res.send(user);
  //   });
  // })(req, res, next);
  var email = req.body.email;
  var password = req.body.password;

  if(!email || !email.length) {
    return res.send(400, { message: 'email is not valid' });
  }
  if(!password || !password.length) {
    return res.send(400, { message: 'password is not valid' });
  }

  User.findOne({ email: email }, function (err, user) {
    if (err) { return next(err); }

    // check if user is already exists
    if (user) {
      return res.send(409, { message: 'the email is already taken.' });
    }

    // create and save a new user
    user = new User({
      email: email,
      password: password
    });

    user.save(function (err, user) {
      if (err) { return next(err); }

      // login after user is registered and saved
      req.logIn(user, function (err) {
        return res.send(user);
      });
    });
  });
}

  // local sigin up strategy
  // passport.use('local-signup', new LocalStrategy({
  //   usernameField: 'email', 
  //   passwordField: 'password'
  // }, 
  // function (email, password, done) {
  //   User.findOne({ email: email }, function (err, user) {
  //     if (err) { return done(err); }
  //     if (user) {
  //       return done(null, false, { message: 'User already exist'});
  //     }
  //     if (!password  || !password.length) {
  //       return done(null, false, { message: 'Invalid password'});
  //     }     
  //     user = new User({
  //       email: email,
  //       password: password
  //     });
  //     user.save(function (err, user) {
  //       if (err) { return done(err); }
  //       return done(null, user);
  //     });
  //   });
  // }));

function signout(req, res) {
  req.logout();
  res.send(200, {success: true, message: "siginout successfull"});
}

function checkSignin(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
}

function facebookAuth() {
  return  passport.authenticate('facebook', { scope : 'email' });
}

function facebookCallback() {
  return passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/'
    });
}

// public functions and variables 
exports.signin = signin;
exports.signup = signup;
exports.signout = signout;
exports.checkSignin = checkSignin;
exports.facebookAuth = facebookAuth;
exports.facebookCallback = facebookCallback;
