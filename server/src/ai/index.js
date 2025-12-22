/**
 * AI Module Index - Export all AI functionality
 */

const aiService = require('./aiService');
const promptBuilder = require('./promptBuilder');

module.exports = {
  ...aiService,
  promptBuilder
};
