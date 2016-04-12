// var bcrypt = require('bcrypt-nodejs');
// var crypto = require('crypto');
var mongoose = require('mongoose');

var fundSchema = new mongoose.Schema({

  hid: { type: String, default: '' },
  investor: { type: String, default: '' },
  investorName: { type: String, default: '' },
  money: { type: Number, default: 1 },
  timestamp: { type: String, default: '' },
  serials: { type: Array, default: [] },
  slotNum: { type: Number, default: 0 },
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



module.exports = mongoose.model('Fund', fundSchema);
