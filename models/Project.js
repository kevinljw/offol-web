// var bcrypt = require('bcrypt-nodejs');
// var crypto = require('crypto');
var mongoose = require('mongoose');

var projSchema = new mongoose.Schema({
  hoster: { type: String, default: '' },
  title: { type: String, default: '' },
  hid: { type: String, default: '' },
  abstract: { type: String, default: '' },
  investorNum: { type: Number, default: 0 },
  goalmoney: { type: Number, default: 1 },
  nowmoney: { type: Number, default: 0 },
  percent: { type: Number, default: 0.0 },
  created_time: { type: String, default: '' },
  main_video: { type: String, default: '' },
  content: { type: String, default: '' },
  bannerPImg: { type: String, default: '' },
  bannerColor: { type: String, default: '#fff' },
  coverPImg:  { type: String, default: '' },
});

/**
 * Password hash middleware.
 */
// userSchema.pre('save', function(next) {
//   var user = this;
//   if (!user.isModified('password')) {
//     return next();
//   }
//   bcrypt.genSalt(10, function(err, salt) {
//     if (err) {
//       return next(err);
//     }
//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       next();
//     });
//   });
// });



module.exports = mongoose.model('Project', projSchema);
