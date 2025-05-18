const mongoose = require('mongoose');

const TranscriptSchema = new mongoose.Schema({
  query:      { type: String, required: true },
  videoId:    { type: String, required: true },
  title:      { type: String, required: true },
  url:        { type: String, required: true },
  transcript: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transcript', TranscriptSchema);
