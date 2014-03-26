/**
 * server.js
 *
 */

'use strict';

// set up ==================================================
var http = require('http'),
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    env = process.env.NODE_ENV || 'development', // env variable
    config = require('./config/config')[env], // config file
    mongoStore = require('connect-mongo')(express), // mongodb session store
    app = express(),// express app
    server = http.createServer(app); // server

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
