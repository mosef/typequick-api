const express = require('express');
const passport = require('passport');
const {Lesson}  = require('../models/lesson');

require('../auth/strategies')(passport);
const router = express.Router();

router.get('/GET', passport.authenticate("jwt", { session: false }), (req, res) => {
  Lesson.find({ chapter })
      .then(lessons => {
        res.status(200).json({lessons});
      })
      .catch(err => {
        res.status(400).json({ error: "something went terribly wrong" });
      });
});

module.exports = { router };
