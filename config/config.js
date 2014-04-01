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
      clientID: "460644617395896",
      clientSecret: "03f0be755cb52da940870179680222b6",
      callbackURL: "http://localhost:3000/auth/facebook/callback" 
    }
  },
  test: {},
  production: {}
};
