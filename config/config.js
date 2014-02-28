/**
 * configuration file
 *
 */
module.exports = {
	development: {
		db: "mongodb://localhost/expAuth",
		app: {
			name: "expAuth-session"
		},
		facebook: {
			clientID: "",
			clientScret: "",
			callbackURL: ""	
		}
	},
	test: {},
	production: {}
};
