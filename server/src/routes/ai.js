const express = require('express');
const ai = require('../ai');
const cache = require('../utils/cache');

const router = express.Router();
const tempQuotaExceededMessage = 'The AI service is currently busy or you have exceeded your free quota. Please try again later.';

/**
 * GET /api/presets
 * Get available AI presets for all categories
 */
router.get('/presets', (req, res) => {
  try {
    const presets = ai.getPresets();
    res.json(presets);
  } catch (error) {
    console.error('Error getting presets:', error);
    res.status(500).json({ error: 'Failed to retrieve presets' });
  }
});

/**
 * POST /api/summarize
 * Generate a summary of video transcript
 * Body: { text, mode?, options? }
 * mode can be: tldr, standard, bulletPoints, eli5, structured
 */
router.post('/summarize', async (req, res) => {
  const { text, mode = 'standard', options = {} } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Check cache first
    const cacheKey = cache.generateKey('summarize', text, mode);
    const cachedSummary = cache.get(cacheKey);
    
    if (cachedSummary) {
      console.log(`Cache hit for summarize:${mode}`);
      return res.json({ summary: cachedSummary, mode, cached: true });
    }

    // Generate new summary
    const summary = await ai.summarize(text, mode, options);
    
    // Store in cache
    cache.set(cacheKey, summary);
    
    res.json({ summary, mode, cached: false });
  } catch (error) {
    console.error('Error summarizing:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'AI Service Quota Exceeded', 
        message: 'The AI service is currently busy or you have exceeded your free quota. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: 'AI Service Quota Exceeded', 
      message: tempQuotaExceededMessage
    });
  }
});

/**
 * POST /api/search
 * Answer a question based on video transcript
 * Body: { text, query, mode?, options? }
 * mode can be: direct, detailed, quote, comparative, explained
 */
router.post('/search', async (req, res) => {
  const { text, query, mode = 'direct', options = {} } = req.body;
  
  if (!text || !query) {
    return res.status(400).json({ error: 'Text and query are required' });
  }

  try {
    // Check cache first (include query in cache key)
    const queryHash = cache.hashText(query);
    const cacheKey = cache.generateKey('search', text, mode, queryHash);
    const cachedAnswer = cache.get(cacheKey);
    
    if (cachedAnswer) {
      console.log(`Cache hit for search:${mode}`);
      return res.json({ answer: cachedAnswer, mode, cached: true });
    }

    // Generate new answer
    const answer = await ai.search(text, query, mode, options);
    
    // Store in cache
    cache.set(cacheKey, answer);
    
    res.json({ answer, mode, cached: false });
  } catch (error) {
    console.error('Error searching:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'AI Service Quota Exceeded', 
        message: 'The AI service is currently busy or you have exceeded your free quota. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'AI Service Quota Exceeded', 
      message: tempQuotaExceededMessage
    });
  }
});

/**
 * POST /api/extract
 * Extract specific information from video transcript
 * Body: { text, extractType, options? }
 * extractType: keyPoints, facts, quotes, resources, steps, definitions
 */
router.post('/extract', async (req, res) => {
  const { text, extractType, options = {} } = req.body;
  
  if (!text || !extractType) {
    return res.status(400).json({ error: 'Text and extractType are required' });
  }

  try {
    // Check cache first
    const cacheKey = cache.generateKey('extract', text, extractType);
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      console.log(`Cache hit for extract:${extractType}`);
      return res.json({ result: cachedResult, extractType, cached: true });
    }

    // Generate new extraction
    const result = await ai.extract(text, extractType, options);
    
    // Store in cache
    cache.set(cacheKey, result);
    
    res.json({ result, extractType, cached: false });
  } catch (error) {
    console.error('Error extracting:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'AI Service Quota Exceeded', 
        message: 'The AI service is currently busy or you have exceeded your free quota. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'AI Service Error', 
      message: error.message || 'Failed to extract information'
    });
  }
});

/**
 * POST /api/chat
 * Chat about video content
 * Body: { text, message, mode?, options? }
 * mode can be: default, tutor, critic, enthusiast, debater
 * Note: Chat responses are NOT cached due to conversational nature
 */
router.post('/chat', async (req, res) => {
  const { text, message, mode = 'default', options = {} } = req.body;
  
  if (!text || !message) {
    return res.status(400).json({ error: 'Text and message are required' });
  }

  try {
    // Note: Chat is not cached because it's conversational and context-dependent
    const response = await ai.chat(text, message, mode, options);
    res.json({ response, mode, cached: false });
  } catch (error) {
    console.error('Error in chat:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'AI Service Quota Exceeded', 
        message: 'The AI service is currently busy or you have exceeded your free quota. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'AI Service Error', 
      message: error.message || 'Failed to generate response'
    });
  }
});

/**
 * GET /api/cache/stats
 * Get cache statistics (for debugging/monitoring)
 */
router.get('/cache/stats', (req, res) => {
  try {
    const stats = cache.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({ error: 'Failed to retrieve cache stats' });
  }
});

/**
 * POST /api/cache/clear
 * Clear the cache manually (admin endpoint)
 */
router.post('/cache/clear', (req, res) => {
  try {
    cache.clear();
    res.json({ success: true, message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

module.exports = router;
