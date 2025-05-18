const { YoutubeTranscript } = require('youtube-transcript');

async function getTranscript(videoId) {
  try {
    const arr = await YoutubeTranscript.fetchTranscript(videoId);
    return arr.map(seg => seg.text).join(' ');
  } catch (err) {
    console.warn(`⚠️ Transcript failed for ${videoId}: ${err.message}`);
    return null;  // skip on error
  }
}

module.exports = { getTranscript };
