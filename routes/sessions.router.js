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
    .catch(err => {
      res.status(400).json({ error: "something went terribly wrong" });
    });
})

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
  .catch(report => {
    res.status(400).json(errorsParser.generateErrorResponse(report));
  })
  .then((createdSession) => {
    User.findById({_id:req.body.userId})
    .catch(report => {
      res.status(400).json(errorsParser.generateErrorResponse(report));
    })
    .then((foundUser) => {
      let found = foundUser.sessions.find((item)=> {
        return (item.currentSession.toString()) == (createdSession._id.toString())
      })
      if(found) {
        return res.status(300).json({ message: "Already exists in user collection" });
      } else {
        foundUser.sessions.push(createdSession._id)
        foundUser.save();
        return res.status(201).json({ message: "Added session to user collection" });
      }
    })
  })
  .catch(report => {
    res.status(400).json(errorsParser.generateErrorResponse(report));
  })
});
// handle data on backend and send it to graph on front end

module.exports = { router };
