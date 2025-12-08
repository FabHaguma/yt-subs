const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '../../temp');

/**
 * Ensure temp directory exists
 */
const ensureTempDir = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  return TEMP_DIR;
};

/**
 * Clean up a temp file
 * @param {string} filename - Name of the file to remove
 */
const cleanupTempFile = (filename) => {
  const filepath = path.join(TEMP_DIR, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};

/**
 * Parse VTT content to extract subtitles
 * @param {string} content - VTT file content
 * @returns {Array} Parsed subtitles with start, end, and text
 */
/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&list=...
 * - https://www.youtube.com/watch?v=VIDEO_ID&pp=...
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - Just the VIDEO_ID itself
 * @param {string} input - YouTube URL or video ID
 * @returns {string} Video ID
 */
const extractVideoId = (input) => {
  if (!input) {
    throw new Error('URL or video ID is required');
  }

  // Trim whitespace
  input = input.trim();

  // If it's already just a video ID (11 characters, alphanumeric with - and _)
  const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  if (videoIdRegex.test(input)) {
    return input;
  }

  // Try to parse as URL
  try {
    const url = new URL(input);
    
    // Handle youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes('youtube.com')) {
      const videoId = url.searchParams.get('v');
      if (videoId && videoIdRegex.test(videoId)) {
        return videoId;
      }
      
      // Handle youtube.com/embed/VIDEO_ID or youtube.com/v/VIDEO_ID
      const pathMatch = url.pathname.match(/^\/(embed|v)\/([a-zA-Z0-9_-]{11})/);
      if (pathMatch) {
        return pathMatch[2];
      }
    }
    
    // Handle youtu.be/VIDEO_ID
    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.slice(1).split('?')[0];
      if (videoIdRegex.test(videoId)) {
        return videoId;
      }
    }
  } catch (e) {
    // Not a valid URL, continue to regex fallback
  }

  // Fallback: try to extract video ID using regex patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }

  throw new Error('Could not extract video ID from the provided input');
};

/**
 * Get a clean YouTube URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} Clean YouTube URL
 */
const getYouTubeUrl = (videoId) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Sanitize filename by removing invalid characters (matching Python app)
 * @param {string} name - Original filename
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (name) => {
  if (!name) return 'untitled';
  
  // Remove or replace invalid filename characters
  let sanitized = name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid chars
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
  
  // Limit length to 100 characters
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }
  
  return sanitized || 'untitled';
};

/**
 * Parse VTT content to extract subtitles
 * @param {string} content - VTT file content
 * @returns {Array} Parsed subtitles with start, end, and text
 */
const parseVTT = (content) => {
  const lines = content.split('\n');
  const subtitles = [];
  let currentSub = {};
  
  const timeRegex = /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === 'WEBVTT') continue;
    if (line === '') continue;

    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      if (currentSub.text) {
        subtitles.push(currentSub);
      }
      currentSub = {
        start: timeMatch[1],
        end: timeMatch[2],
        text: ''
      };
    } else if (currentSub.start) {
      // Remove formatting tags like <c> or <00:00:00>
      const cleanText = line.replace(/<[^>]*>/g, '');
      currentSub.text = currentSub.text ? currentSub.text + ' ' + cleanText : cleanText;
    }
  }
  
  if (currentSub.text) subtitles.push(currentSub);
  
  return subtitles;
};

module.exports = {
  TEMP_DIR,
  ensureTempDir,
  cleanupTempFile,
  parseVTT,
  extractVideoId,
  getYouTubeUrl,
  sanitizeFilename,
};
