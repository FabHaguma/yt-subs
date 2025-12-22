/**
 * Legacy Gemini Service - Maintained for backward compatibility
 * New code should use the ai module instead: require('../ai')
 */

const ai = require('../ai');

/**
 * Generate a summary of the video transcript
 * @param {string} text - Video transcript text
 * @returns {Promise<string>} Generated summary
 * @deprecated Use ai.summarize() instead
 */
const summarize = async (text) => {
  // Use standard mode by default for backward compatibility
  return ai.summarize(text, 'standard');
};

/**
 * Answer a question based on the video transcript
 * @param {string} text - Video transcript text
 * @param {string} query - User's question
 * @returns {Promise<string>} Generated answer
 * @deprecated Use ai.search() instead
 */
const search = async (text, query) => {
  // Use direct mode by default for backward compatibility
  return ai.search(text, query, 'direct');
};

module.exports = {
  summarize,
  search,
};

