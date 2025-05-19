const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  link: { type: String },
  title: { type: String },
  transcript: { type: String },
  language: { type: String },
  duration: { type: Number }, // in seconds
  fetchedAt: { type: Date, default: Date.now },
}, { _id: false });

const transcriptSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true },
  videos: [videoSchema],
});

const TranscriptModel = mongoose.model('Transcript2', transcriptSchema);

/**
 * Stores a transcript for a specific query and video
 * Ensures no duplicate videos are stored for the same query
 * @param {string} query
 * @param {object} videoObj - { videoId, title, transcript, language, duration }
 */
async function storeTranscript(query, videoObj) {
  try {
    const existingQuery = await TranscriptModel.findOne({ query });

    if (existingQuery) {
      // Prevent duplicate videoId
      const alreadyExists = existingQuery.videos.some(v => v.videoId === videoObj.videoId);
      if (!alreadyExists) {
        existingQuery.videos.push(videoObj);
        await existingQuery.save();
        console.log(`✅ Added new video to existing query: ${query}`);
      } else {
        console.log(`⚠️ Duplicate videoId skipped: ${videoObj.videoId}`);
      }
    } else {
      // Create new document
      const newEntry = new TranscriptModel({
        query,
        videos: [videoObj],
      });
      await newEntry.save();
      console.log(`✅ Created new query entry: ${query}`);
    }
  } catch (err) {
    console.error('❌ Error storing transcript:', err.message);
  }
}

module.exports = {
  storeTranscript,
  TranscriptModel,
};
