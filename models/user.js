const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    default: ''
  }
});

UserSchema.pre('save', function userPreSave(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
      return bcrypt.hash(user.password, 10)
          .then((hash) => {
              user.password = hash;
              return next();
          })
          .catch(err => next(err));
  }
  return next();
});

UserSchema.methods.comparePassword = function userComparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);