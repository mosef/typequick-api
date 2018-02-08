const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const errorsParser = require('../middleware/errorsParser.middleware');
const disableWithToken = require('../middleware/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middleware/requiredFields.middleware');

require('../auth/strategies')(passport);

const router = express.Router();

router.route('/register')
  .post(disableWithToken, requiredFields('email', 'username', 'password'), (req, res) => {
    User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    })
      .then(() => {
        User.findOne({ email: req.body.email })
          .then((foundUser) => {
            const tokenPayload = {
              _id: foundUser._id,
              email: foundUser.email,
              username: foundUser.username,
            };
            const token = jwt.sign(tokenPayload, config.JWT_SECRET, {
              expiresIn: config.JWT_EXPIRY,
            });
            return res.status(201).json({ token: `Bearer ${token}` });
          });
      })
      .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
  });

router.post('/login', disableWithToken, requiredFields('email', 'password'), (req, res) => {
  User.findOne({ email: req.body.email })
    .then((foundResult) => {
      if (!foundResult) {
        return res.status(401).json({
          generalMessage: 'Email or password is incorrect',
        });
      }
      return foundResult;
    })
    .then((foundUser) => {
      foundUser.comparePassword(req.body.password)
        .then((comparingResult) => {
          if (!comparingResult) {
            return res.status(401).json({
              generalMessage: 'Password is incorrect',
            });
          }
          const tokenPayload = {
            _id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username,
          };
          const token = jwt.sign(tokenPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRY,
          });
          return res.json({ token: `Bearer ${token}` });
        });
    })
    .catch(report => res.status(401).json(errorsParser.generateErrorResponse(report)));
});

router.post('/refresh', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((foundResult) => {
      if (!foundResult) {
        return res.status(401).json({ generalMessage: 'No token found' });
      } return foundResult;
    })
    .then((foundUser) => {
      const tokenPayload = {
        _id: foundUser._id,
        email: foundUser.email,
        username: foundUser.username,
      };
      const token = jwt.sign(tokenPayload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRY,
      });
      return res.json({ token: `Bearer ${token}` });
    })
    .catch(report => res.status(401).json(errorsParser.generateErrorResponse(report)));
});

router.post(
  '/scores', requiredFields('userId'), passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById({ _id: req.body.userId })
      .then(foundUser => res.status(200).json({ scores: foundUser.scores }))
      .catch(() => {
        res.status(401).json({ error: 'something went terribly wrong' });
      });
  },
);

module.exports = { router };
