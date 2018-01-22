const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  chapter: {
    difficulty: ["Basics", "Advanced", "Expert"],
    page: {
      title: { type: String },
      content: { type: String }
    }
  }
});

const Lesson = mongoose.model("lesson", lessonSchema);

module.exports = Lesson;
