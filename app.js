/**
 * Module dependencies.
 */
// var fs = require('fs');

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');

// var img = require('easyimage');
// var imgs = ['png', 'jpg', 'jpeg', 'gif', 'bmp']; // only make thumbnail for these


var lusca = require('lusca');
var csrf = lusca.csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');

var ghost = require('./ghost-app/ghost-in-the-middle');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var peopleController = require('./controllers/people');
var contactController = require('./controllers/contact');
var introController = require('./controllers/intro');
var loffogramController = require('./controllers/loffogram');
// var shareController = require('./controllers/sharing');
var announcementsController = require('./controllers/announcements');
// var discoverController = require('./controllers/discover');
var hostController = require('./controllers/host');
var projController = require('./controllers/projects');
var postProjController = require('./controllers/postProj');

// var adminController = require('./controllers/admin');
// var ideaController = require('./controllers/idea');
/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({
   customValidators: {
      isArray: function(value) {
          return Array.isArray(value);
      },
      gte: function(param, num) {
          return param >= num;
      },
      lt: function(param, num) {
        return param < num;
      }
   }
})
);
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: false,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// app.use(function(req, res, next) {
//   // Paths that start with /account/upload don't need CSRF
//   console.log(req.originalUrl);
//   if (/^\/account/.test(req.originalUrl) || /^\/account\/upload/.test(req.originalUrl)) {
//     console.log("[Skip]-------");
//     next();
//   } else {
//     console.log("[csrf]-------");
//     csrf(req, res, next);
//   }
// });
app.use( '/loffogram', ghost({
  config: path.join(__dirname, 'ghost-app/config.js')
}) );
/**
 * Primary app routes.
 */
app.get('/', homeController.index);
// app.get('/home', homeController.indexHidden);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact',  contactController.getContact);
app.get('/contact2', contactController.getContact2);
app.post('/contact', contactController.postContact);
// app.get('/people',  peopleController.getPeople);
app.post('/people', peopleController.postPeople);
app.get('/people/:id', peopleController.getPeopleId);
// app.get('/people/mentors',  peopleController.getMentors);
// app.get('/people/ta',  peopleController.getTA);
// app.get('/people/faculty',  peopleController.getFaculty);
app.get('/intro/:id',  introController.getIntro);

app.get('/announcements',  announcementsController.getAnnouncements);

app.get('/discover',  projController.getDiscover);
app.get('/host',  hostController.getHost);
// app.get('/projects/:id', projController.getProject);
app.get('/fundings/:id', passportConf.isAuthenticated, projController.getFunding);
app.post('/fundings/:id', passportConf.isAuthenticated, projController.postFunding);
app.post('/inPerson/:id', passportConf.isAuthenticated, projController.postInPerson);

app.get('/survey/field', passportConf.isAuthenticated, projController.getSurvey);
app.post('/survey', passportConf.isAuthenticated, projController.postSurvey);
// app.get('/payend/field', passportConf.isAuthenticated, projController.getPayEnd);
app.get('/payend/:amount', passportConf.isAuthenticated, projController.getPayTheEnd);

app.get('/record', passportConf.isAuthenticated, userController.getRecord);

// app.get('/loffogram', passportConf.isAuthenticated, loffogramController.getLoffogram);
app.get('/postProj', passportConf.isAuthenticated, postProjController.getPostProj);
app.post('/postProj', passportConf.isAuthenticated, postProjController.postPostProj);
app.post('/deleteProj/:id', passportConf.isAuthenticated, postProjController.deleteProj);
app.get('/postProj/:id', passportConf.isAuthenticated, postProjController.editProj);
app.post('/updateProj/:id', passportConf.isAuthenticated, postProjController.updateProj);

app.get('/projects/:id', projController.getProject);

app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
// app.post('/account/uploadPImg/:id', passportConf.isAuthenticated, uploadPImg.single('userPImg'), userController.postPImg);

app.post('/account/whitelist', passportConf.isAuthenticated, userController.postEmailToWhitelist);
app.post('/account/delete_whitelist', passportConf.isAuthenticated, userController.postDeleteLastWhitelist);

app.post('/authority', passportConf.isAuthenticated, userController.postAuthority);

// app.get('/article', passportConf.isAuthenticated, announcementsController.getArticle);
// app.post('/article/new/:id', passportConf.isAuthenticated, uploadAnnPImg.single('AnnPImg'), announcementsController.postNewArticle);

app.post('/deleteArticle/:id', passportConf.isAuthenticated, announcementsController.postDeleteArticle);
app.post('/deleteShare/:id', passportConf.isAuthenticated, announcementsController.postDeleteShare);
app.post('/deleteIdea/:id', passportConf.isAuthenticated, announcementsController.postDeleteIdea);

app.get('/f98e58c2c27e7131b38f8684695ee891', passportConf.isAuthenticated, projController.getPayEnd);
app.get('/0a0e0389f9f272205d43d978c2f7f03c', passportConf.isAuthenticated, projController.getPayEnd);

// app.get('/idea',  ideaController.getIdea);
// app.post('/idea/new/:id',  ideaController.postIdea);
/**
 * API examples routes.
 */
app.get('/api', passportConf.isAuthenticated, apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postTwitter);
app.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
app.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
// app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized);
app.get('/api/instagram', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getInstagram);
app.get('/api/yahoo', apiController.getYahoo);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/bitgo', apiController.getBitGo);
app.post('/api/bitgo', apiController.postBitGo);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/discover');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/account#linkAcnt');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/account#linkAcnt');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/account#linkAcnt');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
