import axios from 'axios';

const API_BASE = '/api';

/**
 * Fetch video metadata
 */
export const fetchMetadata = async (url) => {
  const response = await axios.post(`${API_BASE}/metadata`, { url });
  return response.data;
};

/**
 * Fetch subtitles with format option
 */
export const fetchSubtitles = async (url, format = 'json') => {
  const response = await axios.post(`${API_BASE}/subtitles`, { 
    url, 
    format
  });
  
  // If format is JSON, parse the content
  if (format === 'json' && typeof response.data.content === 'string') {
    return {
      ...response.data,
      parsed: JSON.parse(response.data.content)
    };
  }
  
  return response.data;
};

/**
 * Download subtitles in specified format
 */
export const downloadSubtitles = async (url, format = 'srt') => {
  const response = await axios.post(`${API_BASE}/download`, {
    url,
    format
  }, {
    responseType: 'blob'
  });
  
  // Extract filename from Content-Disposition header
  const contentDisposition = response.headers['content-disposition'];
  let filename = `subtitles.${format}`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }
  
  // Create download link
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Get available AI presets
 */
export const getPresets = async () => {
  const response = await axios.get(`${API_BASE}/presets`);
  return response.data;
};

/**
 * Summarize text using AI
 */
export const summarizeText = async (text, mode = 'standard', options = {}) => {
  const response = await axios.post(`${API_BASE}/summarize`, { text, mode, options });
  return response.data;
};

/**
 * Search content using AI
 */
export const searchContent = async (text, query, mode = 'direct', options = {}) => {
  const response = await axios.post(`${API_BASE}/search`, { text, query, mode, options });
  return response.data;
};

/**
 * Extract information from content
 */
export const extractContent = async (text, extractType, options = {}) => {
  const response = await axios.post(`${API_BASE}/extract`, { text, extractType, options });
  return response.data;
};

/**
 * Chat about video content
 */
export const chatWithVideo = async (text, message, mode = 'default', options = {}) => {
  const response = await axios.post(`${API_BASE}/chat`, { text, message, mode, options });
  return response.data;
};
