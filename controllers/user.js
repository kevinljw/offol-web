var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');
var adminList = ['evin92@gmail.com'];
var fs = require('fs');
var Fund = require('../models/Fund');

var adminArr = secrets.admin;
// var QRCode = require('qrcode');
// var whiteListArr;
// var whiteListArr_email=[];

// loadWhiteListArr(whiteListArr);

// function loadWhiteListArr(listArr){
//   fs.readFile('./database/white_list.json', 'utf8', function (err,data) {
//         if (err) throw err;
//         whiteListArr = JSON.parse(data);
//         whiteListArr.forEach(function(item){
//           whiteListArr_email.push(item.email);

//         });
//         // console.log(data);
//         console.log("wList:"+whiteListArr.length);
//    });

// }
// function saveWhiteListArr(){
//   fs.writeFile("./database/white_list.json", JSON.stringify(whiteListArr), function(err) {
//             if(err){
//                 return console.log(err);
//             }
//             console.log("The file was saved!");
//   }); 

// }
exports.postDeleteLastWhitelist = function(req, res, next) {
  whiteListArr.pop();
  whiteListArr_email.pop();
  saveWhiteListArr();
  return res.redirect('/account');
};

exports.postEmailToWhitelist = function(req, res, next) {
  // console.log("status:"+req.body.whitelist_status);
  req.assert('whitelist', 'Email is not valid').isEmail();
  // req.assert('uname', 'User name must be at least 1 characters long').len(1);
  // req.assert('password', 'Password must be at least 4 characters long').len(4);
  // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  if(req.body.whitelist.indexOf('@')>-1){
    var newItem = {
      status: req.body.whitelist_status,
      email: req.body.whitelist
    }
    whiteListArr.push(newItem);
    whiteListArr_email.push(newItem.email);
    // console.log("whitelist:"+req.body.whitelist);
    saveWhiteListArr();
    return res.redirect('/account');
  }
  else{
    req.flash('errors', { msg: 'This is not a email address.' });
    return res.redirect('/account');

  }
};
exports.getRecord = function(req, res) {
  // get all the users
  // console.log("getPeople");
    Fund.find({investor: req.user.id}, function(err, thisUserFund) {
      if (err) {
        return res.redirect('/');
      }
      if(thisUserFund){
        console.log(thisUserFund);
        var thisUserBuyingNum = 0;
        async.forEachOf(thisUserFund, function (eachFund, eachFundIndex, thisFund_callback) {
            thisUserBuyingNum+=eachFund.money;
            thisFund_callback();
        },function(err){
          // QRCode.toDataURL('thisUserBuyingNum',function(err,qrUrl){
            if (err) console.error(err.message);
            res.render('record', {
              title: '我的紀錄',
              buynum: thisUserBuyingNum,
              allFund: thisUserFund,
              // qrcodeUrl: qrUrl
            });
          // });
        });
        
      }
      else{
        res.render('record', {
          title: '我的紀錄',
          buynum: 0
        });
      }
    });
};
/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('uname', 'User first name must be at least 1 characters long').len(1);
  // req.assert('lname', 'User last name must be at least 1 characters long').len(1);
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }
  
  // console.log('email:'+whiteListArr_email);
  
    // console.log('--'+whiteListArr[findWlistIndex].status);
    // console.log(adminList.indexOf(req.body.email));
  if(adminArr.indexOf(req.body.email)>-1){
    var user = new User({
      email: req.body.email,
      password: req.body.password,
      profile: {
          name: req.body.uname,
          status: 'admin'
      }
      
    });
  }
  else{
     var user = new User({
      email: req.body.email,
      password: req.body.password,
      profile: {
          name: req.body.uname,
          status: 'guest'
      }
      
    });
  }

    
    User.findOne({ email: req.body.email }, function(err, existingUser) {
            if (existingUser) {
              req.flash('errors', { msg: 'Account with that email address already exists.' });
              return res.redirect('/signup');
            }
            user.save(function(err) {
              if (err) {
                return next(err);
              }
              req.logIn(user, function(err) {
                if (err) {
                  return next(err);
                }
                return res.redirect('/');
              });
            });
    });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {

  User.find({}, function(err, users) {
    if (err) throw err;
   
    res.render('account/profile', {
      title: 'Account Management',
      ulist: users,
      // wList: whiteListArr
    });
    
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.lname = req.body.lname || '';
    user.profile.cname = req.body.cname || '';
    user.profile.birth = req.body.birth || '';
    // user.profile.gender = req.body.gender || '';
    // user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.profile.job = req.body.job || '';
    user.profile.selfThreeWords1 = req.body.selfThreeWords1 || '';
    user.profile.selfThreeWords2 = req.body.selfThreeWords2 || '';
    user.profile.selfThreeWords3 = req.body.selfThreeWords3 || '';
    user.profile.threeInterests1 = req.body.threeInterests1 || '';
    user.profile.threeInterests2 = req.body.threeInterests2 || '';
    user.profile.threeInterests3 = req.body.threeInterests3 || '';
    user.profile.sixThings1 = req.body.sixThings1 || '';
    user.profile.sixThings2 = req.body.sixThings2 || '';
    user.profile.sixThings3 = req.body.sixThings3 || '';
    user.profile.sixThings4 = req.body.sixThings4 || '';
    user.profile.sixThings5 = req.body.sixThings5 || '';
    user.profile.sixThings6 = req.body.sixThings6 || '';
    user.profile.threeKeySkill1 = req.body.threeKeySkill1 || '';
    user.profile.threeKeySkill2 = req.body.threeKeySkill2 || '';
    user.profile.threeKeySkill3 = req.body.threeKeySkill3 || '';
    user.profile.bestAdvice = req.body.bestAdvice || '';
    user.profile.oneBook = req.body.oneBook || '';
    user.profile.oneUrl = req.body.oneUrl || '';
    user.profile.favoritePlace = req.body.favoritePlace || '';
    user.profile.statement = req.body.statement || '';
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) {
      return next(err);
    }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });
    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err) {
            if (err) {
              return next(err);
            }
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Your Hackathon Starter password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Reset your password on Hackathon Starter',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/forgot');
  });
};

exports.postPImg = function(req, res) {
  // console.log('req.body'); //form fields
  // console.log(req.body); //form fields
  // console.log('req.file'); //form fields
  // console.log(req.file); //form files
  User.findById(req.params.id, function(err, thisUser) {
      if (err) throw err;
      thisUser.profile.picture = "/uploadPImg/"+req.file.filename;
      thisUser.save(function(err) {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: 'Profile imgage updated.' });
        res.redirect('/account');
      });
      // console.log("picture: "+thisUser.profile.picture);
      // return res.redirect('/account');
  });
  
  // return res.redirect('/account');
  // var tmp_path = req.files.userPImg.path;
  // console.log("tmp_path: "+tmp_path);
  // // set where the file should actually exists - in this case it is in the "images" directory
  // var target_path = './public/uploadPImg/' + req.files.userPImg.name;
  // // move the file from the temporary location to the intended location
  // console.log("tmp_path:"+tmp_path+" target_path:"+target_path);
  // fs.rename(tmp_path, target_path, function(err) {
  //     if (err) throw err;
  //     // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
  //     fs.unlink(tmp_path, function() {
  //         if (err) throw err;
  //         res.send('File uploaded to: ' + target_path + ' - ' + req.files.userPImg.size + ' bytes');
  //     });
  // });
}