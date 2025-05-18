require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const { searchYouTube } = require('./youtube');
const { getTranscript } = require('./transcript');
const Transcript  = require('./models/Transcript');

const app = express();
const PORT = process.env.PORT || 3001;

// Body parser
app.use(bodyParser.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
.then(() => console.log('🔗 MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/process-queries', async (req, res) => {
  const queries = req.body.queries || [];
  const toInsert = [];

  for (const query of queries) {
    let videos = [];
    try {
      videos = await searchYouTube(query);
    } catch (err) {
      console.error(`YouTube search failed for "${query}":`, err.message);
      continue;
    }

    for (const v of videos) {
      const videoId = v.id.videoId;
      const transcript = await getTranscript(videoId);
      if (!transcript) continue;

      toInsert.push({
        query,
        videoId,
        title: v.snippet.title,
        url:   `https://www.youtube.com/watch?v=${videoId}`,
        transcript
      });
    }
  }

  // Bulk insert (ignores duplicates if you add unique index later)
  try {
    const docs = await Transcript.insertMany(toInsert);
    res.json({ inserted: docs.length, docs });
  } catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ error: 'Failed to save transcripts.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
