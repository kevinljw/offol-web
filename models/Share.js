// var bcrypt = require('bcrypt-nodejs');
// var crypto = require('crypto');
var mongoose = require('mongoose');

var shareSchema = new mongoose.Schema({

  title: { type: String, default: 'File Sharing' },
  description: { type: String, default: '' },
  upload_user: { type: String, default: '' },
  upload_userId: { type: String, default: '' },
  type: { type: String, default: '' },
  filespath: [],
  filesname: [],
  timestamp: { type: String, default: '' }
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



module.exports = mongoose.model('Share', shareSchema);
