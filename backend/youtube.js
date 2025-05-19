// youtube.js
const axios = require('axios');
const { getTranscript } = require('./transcriptFetcher');
const { storeTranscript } = require('./models/Transcript');
require('dotenv').config();

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

async function processQueries(queries) {
  for (const query of queries) {
    try {
      const res = await axios.get(BASE_URL, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoDuration: 'medium', // filters out Shorts
          maxResults: 20,
          key: API_KEY,
        },
      });

      const videos = res.data.items.slice(0, 10);

      for (const video of videos) {
        const videoId = video.id.videoId;
        const title = video.snippet.title;

        const transcriptData = await getTranscript(videoId);
        if (!transcriptData) continue;

        const videoObj = {
          videoId,
          link : "https://youtube.com/watch?v="+videoId,
          title,
          transcript: transcriptData.text,
          language: transcriptData.language,
          duration: transcriptData.duration,
        };

        await storeTranscript(query, videoObj);
        
      }
    } catch (err) {
      console.error(`❌ Error processing query "${query}": ${err.message}`)
      console.log(err);
    }
  }
}

module.exports = { processQueries };
