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
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'AI Service Quota Exceeded', 
        message: 'The AI service is currently busy or you have exceeded your free quota. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message
    });
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
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'AI Service Quota Exceeded', 
        message: 'The AI service is currently busy or you have exceeded your free quota. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to search content',
      message: error.message
    });
  }
});

module.exports = router;
