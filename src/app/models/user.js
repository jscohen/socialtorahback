const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    unique: true,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

// userSchema.plugin(uniqueValidator);
//
userSchema.methods.comparePassword = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};
//
// userSchema.virtual('password').set(function(password) {
//   this._password = password;
// });
//
// userSchema.pre('save', function(next) {
//   const _this = this;
//
//   if (!_this._password) {
//     return next();
//   }
//
//   new Promise((resolve, reject) =>
//     bcrypt.genSalt(null, (err, salt) =>
//         err ? reject(err) : resolve(salt))
//   ).then((salt) =>
//     new Promise((resolve, reject) =>
//       bcrypt.hash(_this._password, salt, (err, data) =>
//         err ? reject(err) : resolve(data)))
//   ).then((digest) => {
//     _this.passwordDigest = digest;
//     next();
//   }).catch((error) => {
//     next(error);
//   });
// });
//
userSchema.methods.setPassword = function(password) {
  const _this = this;

  return new Promise((resolve, reject) =>
    bcrypt.genSalt(null, (err, salt) =>
        err ? reject(err) : resolve(salt))
  ).then((salt) =>
    new Promise((resolve, reject) =>
      bcrypt.hash(password, salt, (err, data) =>
        err ? reject(err) : resolve(data)))
  ).then((digest) => {
    _this.passwordDigest = digest;
    return _this.save();
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
