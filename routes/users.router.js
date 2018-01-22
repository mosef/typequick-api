const express = require('express');
const passport = require('passport');
const User  = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
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
        .then(() => res.status(201).send())
        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
    })
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        res.status(200).json(req.user);
});

router.post('/login', disableWithToken, requiredFields('email', 'password'), (req, res) => {
  User.findOne({ email: req.body.email })
  .then((foundResult) => {
      if (!foundResult) {
          return res.status(400).json({
              generalMessage: 'Email or password is incorrect',
          });
      }
      return foundResult;
  })
  .then((foundUser) => {
      foundUser.comparePassword(req.body.password)
      .then((comparingResult) => {
          if (!comparingResult) {
              return res.status(400).json({
                  generalMessage: 'Email or password is incorrect',
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
  .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
});

router.post('/refresh', (req, res) => {
    User.findOne({ email: req.body.email })
  .then((foundResult) => {
      if (!foundResult) {
          return res.status(400).json({
              generalMessage: 'No token found',
          });
      }
      return foundResult;
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
  .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
});

module.exports = { router };