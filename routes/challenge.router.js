const express = require("express");
const passport = require("passport");
const { Question } = require("../models/question");

require("../auth/strategies")(passport);
const router = express.Router();

router.get("/GET", passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.find({})
      .then(lesson => {
        res.status(200).json({ questions });
      })
      .catch(err => {
        res.status(400).json({ error: "something went terribly wrong" });
      });
  }
);

module.exports = { router };
