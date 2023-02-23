const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = require('../config/default.json').whitelist;
var corsOptionsDelegate = (req, callback) => {
	var corsOptions;
	console.log(req.header('Origin'));
	if (whitelist.indexOf(req.header('Origin')) !== -1) {
		corsOptions = { origin: true };
	} else {
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

module.exports = corsOptionsDelegate();