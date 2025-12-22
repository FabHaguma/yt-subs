/**
 * Prompt Builder - Constructs AI prompts from presets and context
 */

const summaryPresets = require('./presets/summary.presets');
const searchPresets = require('./presets/search.presets');
const extractPresets = require('./presets/extract.presets');
const chatPresets = require('./presets/chat.presets');

// Maximum characters to send to AI (to stay within token limits)
// Approx 200k tokens or 300-400 pages of text
const MAX_CHARS = 800 * 1000; 

/**
 * Truncate text intelligently to stay within limits
 */
const truncateText = (text, maxChars = MAX_CHARS) => {
  if (text.length <= maxChars) return text;
  
  // Try to truncate at a sentence boundary
  const truncated = text.substring(0, maxChars);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastNewline = truncated.lastIndexOf('\n');
  const cutPoint = Math.max(lastPeriod, lastNewline);
  
  if (cutPoint > maxChars * 0.8) {
    return truncated.substring(0, cutPoint + 1) + '\n\n[Transcript truncated due to length]';
  }
  
  return truncated + '\n\n[Transcript truncated due to length]';
};

/**
 * Build a prompt for summarization
 * @param {string} text - The transcript text
 * @param {string} presetId - The preset to use (default: 'standard')
 * @param {Object} options - Additional options
 * @returns {Object} { systemPrompt, userPrompt }
 */
const buildSummaryPrompt = (text, presetId = 'standard', options = {}) => {
  const preset = summaryPresets[presetId] || summaryPresets.standard;
  const truncatedText = truncateText(text, options.maxChars || MAX_CHARS);
  
  let systemPrompt = preset.system;
  
  let userPrompt = `${preset.instruction}\n\n`;
  
  if (preset.outputFormat) {
    userPrompt += `Output format: ${preset.outputFormat}\n\n`;
  }
  
  userPrompt += `Video Transcript:\n${truncatedText}`;
  
  if (options.additionalContext) {
    userPrompt += `\n\nAdditional Context: ${options.additionalContext}`;
  }
  
  return { systemPrompt, userPrompt };
};

/**
 * Build a prompt for search/Q&A
 * @param {string} text - The transcript text
 * @param {string} query - The user's question
 * @param {string} presetId - The preset to use (default: 'direct')
 * @param {Object} options - Additional options
 * @returns {Object} { systemPrompt, userPrompt }
 */
const buildSearchPrompt = (text, query, presetId = 'direct', options = {}) => {
  const preset = searchPresets[presetId] || searchPresets.direct;
  const truncatedText = truncateText(text, options.maxChars || MAX_CHARS);
  
  let systemPrompt = preset.system;
  
  let userPrompt = `${preset.instruction}\n\n`;
  
  if (preset.outputFormat) {
    userPrompt += `Output format: ${preset.outputFormat}\n\n`;
  }
  
  userPrompt += `Video Transcript:\n${truncatedText}\n\n`;
  userPrompt += `Question: ${query}`;
  
  if (options.previousContext) {
    userPrompt = `Previous conversation:\n${options.previousContext}\n\n` + userPrompt;
  }
  
  return { systemPrompt, userPrompt };
};

/**
 * Build a prompt for extraction
 * @param {string} text - The transcript text
 * @param {string} presetId - The extraction type
 * @param {Object} options - Additional options
 * @returns {Object} { systemPrompt, userPrompt }
 */
const buildExtractPrompt = (text, presetId, options = {}) => {
  const preset = extractPresets[presetId];
  
  if (!preset) {
    throw new Error(`Unknown extract preset: ${presetId}`);
  }
  
  const truncatedText = truncateText(text, options.maxChars || MAX_CHARS);
  
  let systemPrompt = preset.system;
  
  let userPrompt = `${preset.instruction}\n\n`;
  
  if (preset.outputFormat) {
    userPrompt += `Output format: ${preset.outputFormat}\n\n`;
  }
  
  userPrompt += `Video Transcript:\n${truncatedText}`;
  
  return { systemPrompt, userPrompt };
};

/**
 * Build a prompt for chat
 * @param {string} text - The transcript text
 * @param {string} message - The user's message
 * @param {string} presetId - The chat mode (default: 'default')
 * @param {Object} options - Additional options including conversation history
 * @returns {Object} { systemPrompt, userPrompt }
 */
const buildChatPrompt = (text, message, presetId = 'default', options = {}) => {
  const preset = chatPresets[presetId] || chatPresets.default;
  const truncatedText = truncateText(text, options.maxChars || MAX_CHARS);
  
  let systemPrompt = preset.system;
  systemPrompt += `\n\nYou have access to the following video transcript for reference:\n${truncatedText}`;
  
  let userPrompt = message;
  
  // If there's conversation history, include it
  if (options.conversationHistory && options.conversationHistory.length > 0) {
    const history = options.conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    userPrompt = `Previous conversation:\n${history}\n\nCurrent message: ${message}`;
  }
  
  return { systemPrompt, userPrompt };
};

/**
 * Get all available presets by category
 */
const getAvailablePresets = () => {
  return {
    summary: Object.values(summaryPresets).map(p => ({
      id: p.id,
      label: p.label,
      description: p.description
    })),
    search: Object.values(searchPresets).map(p => ({
      id: p.id,
      label: p.label,
      description: p.description
    })),
    extract: Object.values(extractPresets).map(p => ({
      id: p.id,
      label: p.label,
      description: p.description
    })),
    chat: Object.values(chatPresets).map(p => ({
      id: p.id,
      label: p.label,
      description: p.description
    }))
  };
};

module.exports = {
  buildSummaryPrompt,
  buildSearchPrompt,
  buildExtractPrompt,
  buildChatPrompt,
  getAvailablePresets,
  truncateText
};
