const express = require('express');
const { youtube } = require('../services');

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint (matching Python app)
 */
router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

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
    res.status(500).json({ 
      error: 'Failed to fetch video metadata',
      message: error.message 
    });
  }
});

/**
 * POST /api/languages
 * Get available subtitle languages (matching Python app)
 */
router.post('/languages', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  try {
    const languages = await youtube.getAvailableLanguages(url);
    res.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch available languages',
      message: error.message 
    });
  }
});

/**
 * POST /api/subtitles
 * Fetch subtitles from YouTube video with language and format options
 */
router.post('/subtitles', async (req, res) => {
  const { url, language_code = 'en', format = 'json', prefer_generated = false } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const result = await youtube.getSubtitles(url, language_code, format, prefer_generated);
    
    // For JSON format, parse the content back to an array for API response
    let content = result.content;
    if (format.toLowerCase() === 'json' && typeof content === 'string') {
      content = JSON.parse(content);
    }
    
    // Always return in a consistent format
    res.json({
      content: content,
      filename: result.filename,
      format: result.format,
      languageCode: result.languageCode,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subtitles',
      message: error.message 
    });
  }
});

/**
 * POST /api/download
 * Download subtitles in specified format (matching Python app)
 */
router.post('/download', async (req, res) => {
  const { url, language_code = 'en', format = 'srt', prefer_generated = false } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const result = await youtube.getSubtitles(url, language_code, format, prefer_generated);
    
    // Set appropriate content type based on format
    const contentTypes = {
      txt: 'text/plain',
      srt: 'application/x-subrip',
      vtt: 'text/vtt',
      json: 'application/json'
    };
    
    const contentType = contentTypes[format.toLowerCase()] || 'text/plain';
    
    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    
    // Send the content
    res.send(result.content);
  } catch (error) {
    console.error('Error downloading subtitles:', error);
    res.status(500).json({ 
      error: 'Failed to download subtitles',
      message: error.message 
    });
  }
});

/**
 * GET /api/download
 * Download subtitles via GET request (browser-friendly, matching Python app)
 */
router.get('/download', async (req, res) => {
  const { url, language_code = 'en', format = 'srt', prefer_generated = 'false' } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const preferGen = prefer_generated === 'true';
    const result = await youtube.getSubtitles(url, language_code, format, preferGen);
    
    // Set appropriate content type
    const contentTypes = {
      srt: 'application/x-subrip',
      vtt: 'text/vtt',
      txt: 'text/plain',
      json: 'application/json'
    };
    
    const contentType = contentTypes[format.toLowerCase()] || 'text/plain';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.content);
  } catch (error) {
    console.error('Error downloading subtitles:', error);
    res.status(500).json({ 
      error: 'Failed to download subtitles',
      message: error.message 
    });
  }
});

module.exports = router;
