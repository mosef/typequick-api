const express = require("express");
const passport = require("passport");
const ms = require('ms');
const { Question } = require("../models/question");
const { Session } = require("../models/session");
const { Lesson } = require("../models/lesson");
const User  = require('../models/user');
const errorsParser = require('../middleware/errorsParser.middleware');
const requiredFields = require('../middleware/requiredFields.middleware');
const router = express.Router();
require("../auth/strategies")(passport);

router.get("/", passport.authenticate("jwt", { session: false }),
(req, res) => {
  Question.find({})
    .then(questions => {
      const startedAt = Date.now();
      return res.status(200).json({ questions, startedAt });
    })
    .catch(report => {
      res.status(400).json(errorsParser.generateErrorResponse(report));
    });
});

router.post("/", requiredFields('userId', 'startedAt', 'stoppedAt'), passport.authenticate("jwt", { session: false }),
(req, res) => {
  let startedAt = req.body.startedAt;
  let stoppedAt = req.body.stoppedAt;
  let userData = [{startedAt, stoppedAt}];
  let timeTaken = userData.map((item) => item.stoppedAt - item.startedAt);
  let scoreTime = ms(timeTaken[0]);
  Session.create({
    startedAt: startedAt,
    stoppedAt: stoppedAt,
    userId: req.body.userId,
    durationInMs: timeTaken[0],
    score: scoreTime
  })
  .then((createdSession) => {
    User.findById({_id:req.body.userId})
    .then((foundUser) => {
      foundUser.sessions.push(createdSession._id)
      foundUser.scores.push({value: scoreTime, sessionId: createdSession._id})
      foundUser.save();
      return res.status(201).json({ message: "Session has been saved." });
    })
  })
  .catch(report => {
    res.status(400).json(errorsParser.generateErrorResponse(report));
  })
});

module.exports = { router };
