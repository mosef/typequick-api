const express = require("express");
const passport = require("passport");
const { Lesson } = require("../models/lesson");
const User  = require('../models/user');
const errorsParser = require('../middleware/errorsParser.middleware');
const disableWithToken = require('../middleware/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middleware/requiredFields.middleware');

require("../auth/strategies")(passport);
const router = express.Router();

router.post("/title", requiredFields('userId', 'lessonTitle'), passport.authenticate("jwt", { session: false }),
  (req, res) => {
  Lesson.findOne({lessonTitle: req.body.lessonTitle})
    .then(lesson => {
      return res.status(200).json({ lesson });
    })
    .catch(report => {
      return res.status(401).json(errorsParser.generateErrorResponse(report));
    });
  }
);

router.post("/", requiredFields('userId', 'lessonId'), passport.authenticate("jwt", { session: false }),
  (req, res) => {
  Lesson.findById({_id: req.body.lessonId})
    .then(foundLesson => {
      User.findById({_id: req.body.userId})
      .then((foundUser) => {
        const found = foundUser.lessons.find((item)=> {
          return (item.currentLesson.toString()) == (foundLesson._id.toString())
        })
        if(found) {
         return res.status(300).json({ message: "Already exists in user collection" });
        } else {
          foundUser.lessons.push({currentLesson: foundLesson._id})
          foundUser.save();
          res.status(201).json({ message: "Added lesson to user collection" });
        }
      })
    })
    .catch(report => {
      res.status(400).json(errorsParser.generateErrorResponse(report));
    })
  }
);

module.exports = { router };
