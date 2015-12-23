var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
// var Admin = require('../models/Admin');
var secrets = require('../config/secrets');


/**
 * POST /account/profile
 * Update profile information.
 */
exports.postEmailToWhitelist = function(req, res, next) {
  
};
