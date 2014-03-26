/*
* app/controllers/auth.js
*/

'use strict';

var passport = require('passport');

// authentication controller functions 

var facebookAuth = passport.authenticate('facebook', { scope : 'email' });
var facebookCallback = passport.authenticate('facebook', { 
  successRedirect : '/',
  failureRedirect : '/'
});

function signin(req, res, next) {
  passport.authenticate('local-signin', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.session.message = [info.message];
      return res.json(401, { success: false, info: info});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      user = user.toObject();
      delete user.password;
      return res.json(user);
    });
  })(req, res, next);
}

function signup(req, res, next) {
  passport.authenticate('local-signup', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.session.message = [info.message];
      return res.json(401, { sucess: false, info: info});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      user = user.toObject();
      delete user.password;
      return res.json(user);
    });
  })(req, res, next);
}

function signout(req, res) {
  req.logout();
  res.json(200, {success: true, message: "siginout successfull"});
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
