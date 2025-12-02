const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// Max characters to send to Gemini (to stay within token limits)
const MAX_CHARS = 30000;
const MODEL_NAME = 'gemini-2.0-flash';

/**
 * Generate a summary of the video transcript
 * @param {string} text - Video transcript text
 * @returns {Promise<string>} Generated summary
 */
const summarize = async (text) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = `Summarize the following YouTube video transcript in a concise manner, highlighting key points:\n\n${text.substring(0, MAX_CHARS)}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

/**
 * Answer a question based on the video transcript
 * @param {string} text - Video transcript text
 * @param {string} query - User's question
 * @returns {Promise<string>} Generated answer
 */
const search = async (text, query) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = `Based on the following video transcript, answer the user's question.\n\nTranscript:\n${text.substring(0, MAX_CHARS)}\n\nQuestion: ${query}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

module.exports = {
  summarize,
  search,
};
