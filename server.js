/**
 * server.js
 *
 */

// set up ==================================================
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var env = process.env.NODE_ENV || 'development'; // env variable
var config = require('./config/config')[env]; // config file
var mongoStore = require('connect-mongo')(express); // mongodb session store
var app = express(); // express app
var server = http.createServer(app); // server

// configuration ===========================================

// db connection
mongoose.connect(config.db);

// passport config
require('./config/passport')(passport, config);

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ 
		secret: 'thisisthefirstclasssecrets', 
		store: new mongoStore({ url: config.db, collection: 'sessions'})
	}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

});

// routes ==================================================
require('./app/routes')(app);

// start server ============================================
server.listen(app.get('port'), function () {
	console.log(config.app.name + ' server listening on port ' + 
							app.get('port') + ' for ' + env);
});
