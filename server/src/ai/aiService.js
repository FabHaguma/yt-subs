/**
 * AI Service - Handles all AI operations with improved error handling and flexibility
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const promptBuilder = require('./promptBuilder');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// Model configuration
const MODEL_NAME = 'gemini-3-flash-preview';
const FALLBACK_MODEL = 'gemini-2.5-flash';

/**
 * Generate content with the AI model
 * @param {string} systemPrompt - System/role prompt
 * @param {string} userPrompt - User prompt
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Generated content
 */
const generateContent = async (systemPrompt, userPrompt, options = {}) => {
  const modelName = options.model || MODEL_NAME;
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemPrompt
    });
    
    const generationConfig = {
      temperature: options.temperature || 0.7,
      topP: options.topP || 0.95,
      topK: options.topK || 40,
      maxOutputTokens: options.maxOutputTokens || 8192,
    };
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig
    });
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Try fallback model if primary fails
    if (modelName === MODEL_NAME && error.status !== 429) {
      console.log(`Primary model failed, trying fallback: ${FALLBACK_MODEL}`);
      return generateContent(systemPrompt, userPrompt, { ...options, model: FALLBACK_MODEL });
    }
    throw error;
  }
};

/**
 * Summarize video transcript
 * @param {string} text - Video transcript
 * @param {string} mode - Summary mode/preset (default: 'standard')
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Summary
 */
const summarize = async (text, mode = 'standard', options = {}) => {
  const { systemPrompt, userPrompt } = promptBuilder.buildSummaryPrompt(text, mode, options);
  return generateContent(systemPrompt, userPrompt, options);
};

/**
 * Answer a question about the video
 * @param {string} text - Video transcript
 * @param {string} query - User's question
 * @param {string} mode - Search mode/preset (default: 'direct')
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Answer
 */
const search = async (text, query, mode = 'direct', options = {}) => {
  const { systemPrompt, userPrompt } = promptBuilder.buildSearchPrompt(text, query, mode, options);
  return generateContent(systemPrompt, userPrompt, options);
};

/**
 * Extract specific information from transcript
 * @param {string} text - Video transcript
 * @param {string} extractType - Type of extraction (keyPoints, facts, quotes, etc.)
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Extracted information
 */
const extract = async (text, extractType, options = {}) => {
  const { systemPrompt, userPrompt } = promptBuilder.buildExtractPrompt(text, extractType, options);
  return generateContent(systemPrompt, userPrompt, options);
};

/**
 * Chat about the video content
 * @param {string} text - Video transcript
 * @param {string} message - User's message
 * @param {string} mode - Chat mode/preset (default: 'default')
 * @param {Object} options - Additional options including conversation history
 * @returns {Promise<string>} Response
 */
const chat = async (text, message, mode = 'default', options = {}) => {
  const { systemPrompt, userPrompt } = promptBuilder.buildChatPrompt(text, message, mode, options);
  return generateContent(systemPrompt, userPrompt, options);
};

/**
 * Get available presets for all categories
 * @returns {Object} All available presets
 */
const getPresets = () => {
  return promptBuilder.getAvailablePresets();
};

module.exports = {
  summarize,
  search,
  extract,
  chat,
  getPresets,
  generateContent
};
