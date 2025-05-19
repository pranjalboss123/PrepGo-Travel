// transcriptFetcher.js
const TranscriptAPI = require('youtube-transcript-api');
const LANGUAGE_PRIORITY = ['en', 'en-IN', 'en-GB', 'en-US', 'hi'];

async function getTranscript(videoId) {
  for (const lang of LANGUAGE_PRIORITY) {
    try {
      const segments = await TranscriptAPI.getTranscript(videoId, lang);
      const transcriptText = segments.map(s => s.text).join(' ');
      return {
        text: transcriptText,
        language: lang
      };
    } catch (err) {
      continue;
    }
  }
  return null;
}

module.exports = { getTranscript };

