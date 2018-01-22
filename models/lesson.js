const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  chapter: {type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}
})

const Lesson = mongoose.model('lesson', lessonSchema);

module.exports = { Lesson };