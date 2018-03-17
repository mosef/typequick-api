const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessonTitle: { type: String },
  chapter: {
    difficulty: ['Basics', 'Advanced', 'Expert'],
    page: {
      title: { type: String },
      content: {
        paragraph: [{ type: String }],
      },
    },
  },
});

const Lesson = mongoose.model('lesson', lessonSchema);

module.exports = { Lesson };
