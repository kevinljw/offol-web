var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  IsAdmin: { type: Boolean, default: false },
  password: String,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  tokens: Array,

  profile: {
    name: { type: String, default: '' },
    lname: { type: String, default: '' },
    cname: { type: String, default: '' },
    birth: { type: String, default: '' },
    // gender: { type: String, default: '' },
    status: { type: String, default: 'fellow' },
    // location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' },
    // job: { type: String, default: 'Student' },
    // selfThreeWords1: { type: String, default: '' },
    // selfThreeWords2: { type: String, default: '' },
    // selfThreeWords3: { type: String, default: '' },
    // threeInterests1: { type: String, default: '' },
    // threeInterests2: { type: String, default: '' },
    // threeInterests3: { type: String, default: '' },
    // sixThings1: { type: String, default: '' },
    // sixThings2: { type: String, default: '' },
    // sixThings3: { type: String, default: '' },
    // sixThings4: { type: String, default: '' },
    // sixThings5: { type: String, default: '' },
    // sixThings6: { type: String, default: '' },
    // threeKeySkill1: { type: String, default: '' },
    // threeKeySkill2: { type: String, default: '' },
    // threeKeySkill3: { type: String, default: '' },
    // bestAdvice: { type: String, default: '' },
    // oneBook: { type: String, default: '' },
    // oneUrl: { type: String, default: '' },
    // favoritePlace: { type: String, default: '' },
    // statement: { type: String, default: '' },
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', userSchema);
