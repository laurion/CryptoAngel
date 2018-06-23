const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,

  roles: Array,
  tokens: Array,

  profile: {
    contactName: String,
    type: {
      type: String,
      enum: ['CHARITY', 'NGO']
    },
    website: String,
    description: String,
    picture: String
  }

}, { timestamps: true });

// generating a hash
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Password hash middleware.
 */
// userSchema.pre('save', function save(next) {
//   const user = this;
//   if (!user.isModified('password')) { return next(); }

//   bcrypt.genSalt(10)
//     .then((salt) => {
//       return bcrypt.hash(user.password, salt);
//     })
//     .then((hash) => {
//       user.password = hash;
//     })
//     .catch((err) => {
//       next(err);
//     });
//   // bcrypt.genSalt(10, (err, salt) => {
//   //   if (err) { return next(err); }
//   //   bcrypt.hash(user.password, salt, null, (err, hash) => {
//   //     if (err) { return next(err); }
//   //     user.password = hash;
//   //     next();
//   //   });
//   // });
// });

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }

  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }

  const md5 = crypto.createHash('md5').update(this.email).digest('hex');

  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
