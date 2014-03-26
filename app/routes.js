
/**
 * app/routes.js
 */

'use strict';

var passport = require('passport'),
    auth = require('../config/middlewares/authorization'),
    authCtrl = require('./controllers/auth'),
    userCtrl = require('./controllers/user');

module.exports = function (app) {

  // secured restful api routes
  app.get('/api/users', auth.requiresSiginin, userCtrl.list);
  
  
  // routes for sign in,  sigin up, and signout processes
  app.post('/signin', authCtrl.signin);
  app.post('/signup', authCtrl.signup);
  app.post('/signout', authCtrl.signout);

  // check if current user is signed in 
  app.get('/signedin', authCtrl.checkSignin);

  // routes for facebook authentication
  app.get('/auth/facebook', authCtrl.facebookAuth);
  app.get('/auth/facebook/callback', authCtrl.facebookCallback);

  // index.html for all other route
  app.get('*', function (req, res) { res.sendfile('./public/index.html'); });
};
