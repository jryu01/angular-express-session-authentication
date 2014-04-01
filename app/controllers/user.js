/*
* app/controllers/user.js
*/

'use strict';

var User = require('../models/user');

function list(req, res) {
	User.find(function (err, users) {
		if (err) return res.send(500);
		res.send(users);
	});	
}

// function get(req, res){:w

// }

// function create(req, res){
	
// }

// function update(req, res){
	
// }

// function remove(req, res){
	
// }

// public functions
exports.list = list;