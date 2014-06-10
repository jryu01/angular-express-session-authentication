/**
 * configuration file
 *
 */

'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    root: rootPath, 
    db: "mongodb://localhost/session-auth",
    app: {
      name: "angular-express-session-authentication"
    },
    facebook: {
      clientID: "481914391941067",
      clientSecret: "0a1cb8b41c20ed13490b1ea494e5ec03",
      callbackURL: "http://localhost:3000/auth/facebook/callback" 
    }
  },
  test: {},
  production: {}
};
