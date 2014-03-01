/**
 * passport.js
 * passport configuration file
 */
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/user');

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
		}
	));

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
				user = new User({
					email: email,
					password: password
				});
				user.save(function (err, user) {
					if (err) { return done(err); }
					return done(null, user);
				});
			});
		}
	));

	//Facebook Strategy
};
