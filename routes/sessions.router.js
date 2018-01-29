require("../auth/strategies")(passport);
const express = require("express");
const passport = require("passport");
const { Question } = require("../models/question");
const { Session } = require("../models/session");
const router = express.Router();

router.get("/GET", passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.find({})
      .then(questions => {
        res.status(200).json({ questions });
      })
      .catch(err => {
        res.status(400).json({ error: "something went terribly wrong" });
      });
  }
);

router.post("/POST", passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const requiredFields = ["userId", "startedAt", "stoppedAt"];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        return res.status(400).send(message);
      } else {
        const startedAt = req.body.startedAt;
        const stoppedAt = req.body.stoppedAt;
        const userData = [
          {
            userId,
            startedAt,
            stoppedAt,
            durationInMs,
            score
          }
        ]
      }
      let timeTaken = userData.map((data) => data.stoppedAt - data.startedAt);
      console.log(timeTaken)
    }
    Session.create({
      startedAt: req.user.id,
      stoppedAt: req.body.title,
      userId: req.user.id,
      durationInMs: timeTaken,
      score: 'blank'
    })
      .then(sessionSaved => res.status(201).json(savedSession))
      .catch(err => {
        res.status(500).json({ error: "something went wrong" });
      });
  }
);

module.exports = { router };
