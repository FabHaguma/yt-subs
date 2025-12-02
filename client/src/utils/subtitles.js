/**
 * Format subtitles for clipboard copy
 * @param {Array} subtitles - Array of subtitle objects with start and text properties
 * @param {boolean} withTimestamps - Whether to include timestamps
 * @returns {string} Formatted text
 */
export const formatSubtitlesForCopy = (subtitles, withTimestamps) => {
  if (withTimestamps) {
    return subtitles.map(s => `[${s.start}] ${s.text}`).join('\n');
  }
  return subtitles.map(s => s.text).join(' ');
};

/**
 * Get full text from subtitles (without timestamps)
 * @param {Array} subtitles - Array of subtitle objects
 * @returns {string} Combined text
 */
export const getFullText = (subtitles) => {
  return subtitles.map(s => s.text).join(' ');
};

/**
 * Download subtitles in various formats
 * @param {Object} options - Download options
 * @param {Array} options.subtitles - Parsed subtitles
 * @param {string} options.rawSubtitles - Raw VTT content
 * @param {string} options.title - Video title
 * @param {string} options.channel - Channel name
 * @param {string} options.format - Format: 'txt', 'json', or 'vtt'
 */
export const downloadSubtitles = ({ subtitles, rawSubtitles, title, channel, format }) => {
  let content = '';
  // Sanitize filename parts to remove invalid characters
  const safeTitle = (title || 'subtitles').replace(/[<>:"/\\|?*]/g, '_');
  const safeChannel = channel ? channel.replace(/[<>:"/\\|?*]/g, '_') : '';
  const baseFilename = safeChannel ? `${safeChannel} - ${safeTitle}` : safeTitle;
  let filename = `${baseFilename}.${format}`;
  let type = 'text/plain';

  switch (format) {
    case 'json':
      content = JSON.stringify(subtitles, null, 2);
      type = 'application/json';
      break;
    case 'txt':
      content = subtitles.map(s => s.text).join(' ');
      break;
    case 'vtt':
    case 'srt':
      content = rawSubtitles;
      filename = `${baseFilename}.vtt`;
      break;
    default:
      content = subtitles.map(s => s.text).join(' ');
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};
