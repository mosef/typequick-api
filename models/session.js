const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  startedAt: { type:Number },
  stoppedAt: { type:Number },
  durationInMs: { type:Number },
  userId: { type: String },
  score: { type:Number }
});

const Session = mongoose.model("session", sessionSchema);

module.exports = {Session};
