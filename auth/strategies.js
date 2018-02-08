const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config');

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');
  opts.secretOrKey = config.JWT_SECRET;
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.findById(jwtPayload._id)
      .then((user) => {
        if (user) {
          const userData = {
            _id: user._id,
            email: user.email,
            username: user.username,
          };
          done(null, userData);
        } else {
          done(null, false);
        }
      })
      .catch(error => done(error, false));
  }));
};
