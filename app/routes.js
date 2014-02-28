/**
 * routes for the app
 *
 */
var passport = require('passport');
var User = require('./models/user');
var auth = require('../config/middlewares/authorization');

module.exports = function (app) {

	// secured restful api routes
	app.get('/api/users', auth.requiresSiginin, function (req, res) {
		User.find(function (err, users) {
			if (err) return res.send(500);
			res.json(users);
		});
	});
	
	
	// routes for sign in,  sigin up, and signout processes
	app.post('/signin', function (req, res, next) {
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
	});

	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (err, user, info) {
			if (err) { return next(err); }
			if (!user) {
				req.session.message = [info.message];
				return res.json(401, { sucess: false, info: info});
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.json(user);
			});
		})(req, res, next);
	});

	app.post('/signout', function (req, res) {
		req.logout();
		res.json(200, {success: true, message: "siginout successfull"});
	});

	// route to check if user is signed in
	app.get('/signedin', function (req, res) {
		res.send(req.isAuthenticated() ? req.user : '0');
	});

	// index.html for all other route
	app.get('*', function (req, res) {
		res.sendfile('./public/index.html');
	});
};
