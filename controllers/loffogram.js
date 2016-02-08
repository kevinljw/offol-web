var secrets = require('../config/secrets');
var User = require('../models/User');
var moment = require('moment');
var Fund = require('../models/Fund');
var async = require('async');
var md5 = require('md5');


exports.getLoffogram = function(req, res) {
	// console.log(req.query.id);
	// console.log(req.query.amount);
	// res.redirect('/survey');
	res.render('loffogram', {
      title: 'Loffogram'
    });

};