const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {Session} = require('./session')

const lessonSchema = new mongoose.Schema({
  chapter: {
    difficulty: ["Basics", "Advanced", "Expert"],
    page: {
      title: { type: String },
      content: { type: String }
    }
  },
  userScore: { type:Number },
  sessions: [{type: Schema.Types.ObjectId, ref:'Session'}]
});

const Lesson = mongoose.model("lesson", lessonSchema);

module.exports = {Lesson};
