const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new mongoose.Schema({
  lessonTitle: { type: String },
  chapter: {
    difficulty: ["Basics", "Advanced", "Expert"],
    page: {
      title: { type: String },
      content: { type: String }
    }
  }
});

const Lesson = mongoose.model("lesson", lessonSchema);

module.exports = {Lesson};
