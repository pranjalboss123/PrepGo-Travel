const axios = require('axios');
const API_KEY = process.env.YOUTUBE_API_KEY;

async function searchYouTube(query) {
  const { data } = await axios.get(
    'https://www.googleapis.com/youtube/v3/search', {
      params: {
        part:       'snippet',
        q:          query,
        key:        API_KEY,
        type:       'video',
        maxResults: 10,           // ← top 10
      }
    }
  );
  return data.items;
}

module.exports = { searchYouTube };
