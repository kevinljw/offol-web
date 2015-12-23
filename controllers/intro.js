var secrets = require('../config/secrets');
var User = require('../models/User');
var moment = require('moment');

/**
 * GET /intro/:id
 * 
 */
exports.getIntro = function(req, res) {
  // get all the users
 
    User.findById(req.params.id, function(err, thisUser) {
      if (err) throw err;

      var formatedData = {
          'email': thisUser.email,
          'cname': thisUser.profile.cname,
          'name': thisUser.profile.name, 
          'lname': thisUser.profile.lname,
          'birth': thisUser.profile.birth!=''?moment(Date.parse(thisUser.profile.birth)).format("MM / DD"):' - / - ',
          'status': thisUser.profile.status,
          'picture': thisUser.profile.picture,
          'website': thisUser.profile.website,
          'facebook': thisUser.facebook,
          'twitter': thisUser.twitter,
          'linkedin': thisUser.linkedin,
          'instagram': thisUser.instagram,
          'job': thisUser.profile.job,
          'statement': thisUser.profile.statement.replace(/\r?\n/g, '<br />'),
          'selfThreeWords1': thisUser.profile.selfThreeWords1,
          'selfThreeWords2': thisUser.profile.selfThreeWords2,
          'selfThreeWords3': thisUser.profile.selfThreeWords3,
          'threeInterests1': thisUser.profile.threeInterests1,
          'threeInterests2': thisUser.profile.threeInterests2,
          'threeInterests3': thisUser.profile.threeInterests3,
          'sixThings1': thisUser.profile.sixThings1,
          'sixThings2': thisUser.profile.sixThings2,
          'sixThings3': thisUser.profile.sixThings3,
          'sixThings4': thisUser.profile.sixThings4,
          'sixThings5': thisUser.profile.sixThings5,
          'sixThings6': thisUser.profile.sixThings6,
          'threeKeySkill1': thisUser.profile.threeKeySkill1,
          'threeKeySkill2': thisUser.profile.threeKeySkill2,
          'threeKeySkill3': thisUser.profile.threeKeySkill3,
          'bestAdvice': thisUser.profile.bestAdvice.replace(/\r?\n/g, '<br />'),
          'oneBook': thisUser.profile.oneBook.replace(/\r?\n/g, '<br />'),
          'oneUrl': thisUser.profile.oneUrl.replace(/\r?\n/g, '<br />'),
          'favoritePlace': thisUser.profile.favoritePlace.replace(/\r?\n/g, '<br />')
      }

      res.render('intro', {
        title: thisUser.profile.name,
        thisProfile: formatedData
      });
  
    });
};
