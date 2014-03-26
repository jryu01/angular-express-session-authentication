/**
 * configuration file
 *
 */

'use strict';

module.exports = {
	development: {
		db: "mongodb://localhost/expAuth",
		app: {
			name: "expAuth-session"
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
