// var bcrypt = require('bcrypt-nodejs');
// var crypto = require('crypto');
var mongoose = require('mongoose');

var ideaSchema = new mongoose.Schema({

  title: { type: String, default: '' },
  description: { type: String, default: '' },
  author: { type: String, default: '' },
  authorId: { type: String, default: '' },
  timestamp: { type: String, default: '' },
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



module.exports = mongoose.model('Idea', ideaSchema);
