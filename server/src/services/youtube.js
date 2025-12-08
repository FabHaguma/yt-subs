const { YoutubeTranscript } = require('youtube-transcript');
const { Innertube } = require('youtubei.js');
const axios = require('axios');
const { extractVideoId, sanitizeFilename } = require('../utils');

/**
 * Get video metadata using Innertube API to ensure all fields are present
 * @param {string} input - YouTube video URL or video ID
 * @returns {Promise<Object>} Video metadata
 */
const getMetadata = async (input) => {
  try {
    const videoId = extractVideoId(input);
    
    // Use Innertube API to get complete metadata including views, duration, and upload date
    const youtube = await Innertube.create();
    const info = await youtube.getBasicInfo(videoId);
    
    // Format upload date from YYYYMMDD if available
    let uploadDate = null;
    if (info.basic_info.publish_date) {
      // If it's already in YYYYMMDD format, use it as-is
      uploadDate = info.basic_info.publish_date.replace(/-/g, '');
    }
    
    return {
      id: videoId,
      title: info.basic_info.title,
      channel: info.basic_info.author,
      thumbnail: info.basic_info.thumbnail?.[0]?.url,
      duration: info.basic_info.duration,
      viewCount: info.basic_info.view_count,
      uploadDate: uploadDate,
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw new Error(`Failed to fetch video metadata: ${error.message}`);
  }
};

/**
 * Get available transcript languages for a video (like Python app)
 * Note: youtube-transcript library doesn't support listing languages,
 * so we'll return the most common languages and let the user try them
 * @param {string} input - YouTube video URL or video ID
 * @returns {Promise<Object>} Available languages
 */
const getAvailableLanguages = async (input) => {
  try {
    const videoId = extractVideoId(input);
    
    // Try fetching English transcript to verify video has subtitles
    try {
      await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    } catch (error) {
      // Video might not have English, that's ok
    }
    
    // Return common language codes
    // Users can try these, and the actual fetch will fail if not available
    const commonLanguages = [
      { language: 'English', language_code: 'en', is_generated: false, is_translatable: true },
      { language: 'Spanish', language_code: 'es', is_generated: false, is_translatable: true },
      { language: 'French', language_code: 'fr', is_generated: false, is_translatable: true },
      { language: 'German', language_code: 'de', is_generated: false, is_translatable: true },
      { language: 'Portuguese', language_code: 'pt', is_generated: false, is_translatable: true },
      { language: 'Italian', language_code: 'it', is_generated: false, is_translatable: true },
      { language: 'Russian', language_code: 'ru', is_generated: false, is_translatable: true },
      { language: 'Japanese', language_code: 'ja', is_generated: false, is_translatable: true },
      { language: 'Korean', language_code: 'ko', is_generated: false, is_translatable: true },
      { language: 'Chinese (Simplified)', language_code: 'zh-Hans', is_generated: false, is_translatable: true },
    ];
    
    return {
      video_id: videoId,
      manual: commonLanguages,
      generated: []
    };
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw new Error(`Failed to fetch available languages: ${error.message}`);
  }
};

/**
 * 
 * @param {string} input - YouTube video URL or video ID
 * @param {string} languageCode - Language code (default: 'en')
 * @param {string} format - Output format: 'srt', 'vtt', 'txt', 'json'
 * @param {boolean} preferGenerated - Prefer auto-generated subtitles
 * @returns {Promise<Object>} Formatted subtitles and metadata
 */
const getSubtitles = async (input, languageCode = 'en', format = 'txt', preferGenerated = false) => {
  try {
    const videoId = extractVideoId(input);
    console.log(`Fetching subtitles for video: ${videoId}, language: ${languageCode} from external API`);
    
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const apiUrl = 'https://tubetext.haguma.com/api/download';

    const response = await axios.get(apiUrl, {
      params: {
        url: videoUrl,
        language_code: languageCode,
        format: format
      },
      responseType: format.toLowerCase() === 'json' ? 'json' : 'text'
    });

    const content = response.data;
    
    // Get metadata for filename
    let metadata;
    try {
      metadata = await getMetadata(videoId);
    } catch (error) {
      console.warn('Could not fetch metadata:', error.message);
      metadata = { id: videoId, title: 'video', channel: 'unknown' };
    }
    
    // Generate filename like Python app: "channel - title [lang].ext"
    const filename = generateFilename(metadata, languageCode, format);
    
    return {
      content: content,
      filename,
      format,
      languageCode,
      metadata
    };
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Failed to fetch subtitles: ${errorMessage}`);
  }
};

/**
 * Format transcript to different formats (matching Python app)
 * @param {Array} transcript - Raw transcript data
 * @param {string} format - Output format
 * @returns {string} Formatted content
 */
const formatTranscript = (transcript, format) => {
  switch (format.toLowerCase()) {
    case 'srt':
      return formatToSRT(transcript);
    case 'vtt':
      return formatToVTT(transcript);
    case 'txt':
      return formatToTXT(transcript);
    case 'json':
      return JSON.stringify(transcript, null, 2);
    default:
      return formatToSRT(transcript);
  }
};

/**
 * Format transcript to SRT format
 */
const formatToSRT = (transcript) => {
  let srt = '';
  transcript.forEach((entry, index) => {
    const startTime = formatTime(entry.offset / 1000);
    const endTime = formatTime((entry.offset + entry.duration) / 1000);
    srt += `${index + 1}\n${startTime} --> ${endTime}\n${entry.text}\n\n`;
  });
  return srt;
};

/**
 * Format transcript to VTT format
 */
const formatToVTT = (transcript) => {
  let vtt = 'WEBVTT\n\n';
  transcript.forEach((entry) => {
    const startTime = formatTime(entry.offset / 1000);
    const endTime = formatTime((entry.offset + entry.duration) / 1000);
    vtt += `${startTime} --> ${endTime}\n${entry.text}\n\n`;
  });
  return vtt;
};

/**
 * Format transcript to plain text
 */
const formatToTXT = (transcript) => {
  return transcript.map(entry => entry.text).join(' ');
};

/**
 * Format time in HH:MM:SS,mmm format for SRT
 */
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
};

/**
 * Generate filename like Python app: "channel - title [lang].ext"
 */
const generateFilename = (metadata, languageCode, format) => {
  const channel = sanitizeFilename(metadata.channel || 'unknown');
  const title = sanitizeFilename(metadata.title || 'video');
  return `${channel} - ${title} [${languageCode}].${format}`;
};

module.exports = {
  getMetadata,
  getAvailableLanguages,
  getSubtitles,
};
