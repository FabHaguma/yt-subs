const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');
const { ensureTempDir, parseVTT, cleanupTempFile, TEMP_DIR, extractVideoId, getYouTubeUrl } = require('../utils');

/**
 * Fetch video metadata from YouTube
 * @param {string} input - YouTube video URL or video ID
 * @returns {Promise<Object>} Video metadata
 */
const getMetadata = async (input) => {
  const videoId = extractVideoId(input);
  const url = getYouTubeUrl(videoId);
  
  const output = await youtubedl(url, {
    dumpSingleJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ['referer:youtube.com', 'user-agent:googlebot']
  });

  return {
    title: output.title,
    channel: output.uploader,
    uploadDate: output.upload_date,
    viewCount: output.view_count,
    duration: output.duration,
    thumbnail: output.thumbnail,
    id: output.id
  };
};

/**
 * Fetch subtitles from YouTube video
 * @param {string} input - YouTube video URL or video ID
 * @returns {Promise<Object>} Raw and parsed subtitles
 */
const getSubtitles = async (input) => {
  const videoId = extractVideoId(input);
  const url = getYouTubeUrl(videoId);
  
  const tempDir = ensureTempDir();
  const timestamp = Date.now();
  const outputTemplate = path.join(tempDir, `${timestamp}.%(ext)s`);

  // Download subtitles converted to VTT
  await youtubedl(url, {
    skipDownload: true,
    writeAutoSub: true,
    writeSub: true,
    subLang: 'en',
    subFormat: 'vtt',
    output: outputTemplate,
    noCheckCertificates: true,
  });

  // Find the generated file
  const files = fs.readdirSync(tempDir);
  const subFile = files.find(f => f.startsWith(timestamp.toString()) && f.endsWith('.vtt'));

  if (!subFile) {
    throw new Error('No English subtitles found');
  }

  const content = fs.readFileSync(path.join(tempDir, subFile), 'utf-8');
  
  // Cleanup temp file
  cleanupTempFile(subFile);

  // Parse VTT content
  const subtitles = parseVTT(content);

  return { raw: content, parsed: subtitles };
};

module.exports = {
  getMetadata,
  getSubtitles,
};
