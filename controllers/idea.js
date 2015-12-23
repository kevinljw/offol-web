var secrets = require('../config/secrets');
var moment = require('moment');
var User = require('../models/User');
var Idea = require('../models/Idea');
/**
 * GET /contact
 * Contact form page.
 */
exports.getIdea = function(req, res) {
  // var FILESTYPE;
  Idea.find({}, function(err, ideas) {
    if (err) throw err;
    res.render('idea', {
    	title: 'Idea',
    	ideaList: ideas.reverse()
  	});
  });
  
};


exports.postIdea = function(req, res, next) {
  req.assert('title', 'Title must be at least 1 characters long').len(1);
  req.assert('description', 'Description must be at least 1 characters long').len(1);
  var errors = req.validationErrors();

  if (errors) {
      req.flash('errors', errors);
      return res.redirect('/idea');
  }

	User.findById(req.params.id, function(err, thisUser) {
      if (!thisUser) {
        req.flash('errors', { msg: 'No account with that id exists.' });
        return res.redirect('/');
      }
      var thisIdea = new Idea({
        title: req.body.title,
        description: replaceURLWithHTMLLinks(req.body.description.replace(/\r?\n/g, '<br />')),
        author: thisUser.profile.name,
        authorId: req.params.id,
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
        
      });
      console.log(thisIdea);
      thisIdea.save(function(err) {
          if (err) {
            return next(err);
          }
          req.flash('success', { msg: 'Done.' });
          res.redirect('/idea');
      });


  });

};

function replaceURLWithHTMLLinks(text) {
    var re = /(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig;
    return text.replace(re, function(match, lParens, url) {
        var rParens = '';
        lParens = lParens || '';

        // Try to strip the same number of right parens from url
        // as there are left parens.  Here, lParenCounter must be
        // a RegExp object.  You cannot use a literal
        //     while (/\(/g.exec(lParens)) { ... }
        // because an object is needed to store the lastIndex state.
        var lParenCounter = /\(/g;
        while (lParenCounter.exec(lParens)) {
            var m;
            // We want m[1] to be greedy, unless a period precedes the
            // right parenthesis.  These tests cannot be simplified as
            //     /(.*)(\.?\).*)/.exec(url)
            // because if (.*) is greedy then \.? never gets a chance.
            if (m = /(.*)(\.\).*)/.exec(url) ||
                    /(.*)(\).*)/.exec(url)) {
                url = m[1];
                rParens = m[2] + rParens;
            }
        }
        return lParens + "<a href='" + url + "'>" + url + "</a>" + rParens;
    });
}

