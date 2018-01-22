const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({
  difficulty: ["Basics", "Advanced", "Expert"],
  page: {
    title: {type: String},
    content: {type: String}
  },
})

const Chapter = mongoose.model('chapter', chapterSchema);

module.exports = { Chapter };
