const TranscriptAPI = require('youtube-transcript-api');

// Define your language preference order
const LANGUAGE_PRIORITY = ['en', 'en-IN', 'en-GB', 'en-US', 'hi'];

/**
 * Fetches the transcript for a YouTube video in the preferred language order.
 * @param {string} videoId - The ID of the YouTube video.
 * @returns {Promise<string|null>} - The transcript text or null if unavailable.
 */
async function getTranscript(videoId) {
  for (const lang of LANGUAGE_PRIORITY) {
    try {
      const transcriptSegments = await TranscriptAPI.getTranscript(videoId, lang);
      const transcriptText = transcriptSegments.map(segment => segment.text).join(' ');
      console.log(`✅ Transcript fetched for ${videoId} in language: ${lang}`);
      return transcriptText;
    } catch (error) {
      console.warn(`❌ Failed to fetch transcript for ${videoId} in language: ${lang}. Error: ${error.message}`);
      continue;
    }
  }
  console.warn(`⚠️ No transcript available for video ${videoId} in preferred languages.`);
  return null;
}

module.exports = { getTranscript };
