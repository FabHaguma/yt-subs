import axios from 'axios';

const API_BASE = '/api';

export const fetchMetadata = async (url) => {
  const response = await axios.post(`${API_BASE}/metadata`, { url });
  return response.data;
};

export const fetchSubtitles = async (url) => {
  const response = await axios.post(`${API_BASE}/subtitles`, { url });
  return response.data;
};

export const summarizeText = async (text) => {
  const response = await axios.post(`${API_BASE}/summarize`, { text });
  return response.data;
};

export const searchContent = async (text, query) => {
  const response = await axios.post(`${API_BASE}/search`, { text, query });
  return response.data;
};
