const express = require('express');
const { gemini } = require('../services');

const router = express.Router();

/**
 * POST /api/summarize
 * Generate a summary of video transcript
 */
router.post('/summarize', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const summary = await gemini.summarize(text);
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

/**
 * POST /api/search
 * Answer a question based on video transcript
 */
router.post('/search', async (req, res) => {
  const { text, query } = req.body;
  
  if (!text || !query) {
    return res.status(400).json({ error: 'Text and query are required' });
  }

  try {
    const answer = await gemini.search(text, query);
    res.json({ answer });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Failed to search content' });
  }
});

module.exports = router;
