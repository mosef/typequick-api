const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new mongoose.Schema({
  startedAt: { type: Number },
  stoppedAt: { type: Number },
  durationInMs: { type: Number },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  score: { type: String },
});

const Session = mongoose.model('session', sessionSchema);

module.exports = { Session };
