const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
  questions: [
    {
      question: {
        header: { type: String },
        answer: { type: String },
      },
    },
  ],
});

const Question = mongoose.model('question', questionsSchema);

module.exports = { Question };
