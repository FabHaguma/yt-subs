const express = require('express');
const { youtube } = require('../services');

const router = express.Router();

/**
 * POST /api/metadata
 * Fetch video metadata from YouTube
 */
router.post('/metadata', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const metadata = await youtube.getMetadata(url);
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch video metadata' });
  }
});

/**
 * POST /api/subtitles
 * Fetch subtitles from YouTube video
 */
router.post('/subtitles', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const subtitles = await youtube.getSubtitles(url);
    res.json(subtitles);
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    res.status(500).json({ error: 'Failed to fetch subtitles' });
  }
});

module.exports = router;
