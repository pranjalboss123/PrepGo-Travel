require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { processQueries } = require('./youtube'); // upgraded function
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('🔗 MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API: POST /process-queries
app.post('/process-queries', async (req, res) => {
  const queries = req.body.queries;

  if (!Array.isArray(queries) || queries.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty queries array.' });
  }

  try {
    await processQueries(queries);
    res.json({
      message: '✅ Queries processed and transcripts saved.'
    });

  } catch (err) {
    console.error('❌ Processing error:', err.message);
    res.status(500).json({ error: 'Failed to process queries.' });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
