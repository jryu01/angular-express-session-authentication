/**
 * passport.js
 * passport configuration file
 */

'use strict';

var LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('../app/models/user');

module.exports = function (passport, config) {
    
  // serialize user into session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deseriallize user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  }); 

  // local sigin in strategy
  passport.use('local-signin', new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, '+password', function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Unknown email' });
      }
      user.comparePassword(password, function (err, isMatch) {
        if (err) { return done(err); }
        if(!isMatch) {
          return done(null, false, { message: 'Invalid password.' });
        }
        return done(null, user);
      });
    });
  }));

  // local sigin up strategy
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password'
  }, 
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (user) {
        return done(null, false, { message: 'User already exist'});
      }
      if (!password  || !password.length) {
        return done(null, false, { message: 'Invalid password'});
      }     
      user = new User({
        email: email,
        password: password
      });
      user.save(function (err, user) {
        if (err) { return done(err); }
        return done(null, user);
      });
    });
  }));

  //Facebook Strategy
  passport.use(new FacebookStrategy({

    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  }, 
  function (accessToken, refreshToken, profile, done) {
    User.findOne({'facebook.id': profile.id}, function (err, user) {

      if (err) { return done(err); }
      if (user) { return done(null, user); }
      if (!user) {

        // create a new user
        user = new User();

        user.facebook.id = profile.id;
        user.facebook.name = profile.name.givenName + 
                            ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;
        user.facebook.accessToken = accessToken;

        user.save(function (err) {
          if (err) { return done(err); }
          return done(null, user);
        });
      }
    });
  }));
};
