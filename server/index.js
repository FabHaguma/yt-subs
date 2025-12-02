const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from the React client
app.use(express.static(path.join(__dirname, '../client/dist')));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to parse VTT/SRT content (simple regex based for now, or just return raw)
// We will try to get JSON subs from yt-dlp if possible, or parse the text.
// yt-dlp can dump json subs.

app.post('/api/metadata', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const output = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });

    const metadata = {
      title: output.title,
      channel: output.uploader,
      uploadDate: output.upload_date,
      viewCount: output.view_count,
      duration: output.duration,
      thumbnail: output.thumbnail,
      id: output.id
    };

    res.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch video metadata' });
  }
});

app.post('/api/subtitles', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // We use writeAutoSub and writeSub to get subtitles. 
    // We need to output to stdout or a temporary file. 
    // youtube-dl-exec returns the output of the command.
    // However, getting the actual subtitle content is tricky with just flags because it writes to file.
    // We will use a temporary directory.
    
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    
    const timestamp = Date.now();
    const outputTemplate = path.join(tempDir, `${timestamp}.%(ext)s`);

    // First, list subs to see what's available? 
    // Or just try to download auto-subs (en) or manual subs (en).
    
    // Command to download subtitles converted to vtt
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
      return res.status(404).json({ error: 'No English subtitles found' });
    }

    const content = fs.readFileSync(path.join(tempDir, subFile), 'utf-8');
    
    // Cleanup
    fs.unlinkSync(path.join(tempDir, subFile));

    // Simple VTT parser to get clean text and timestamps
    const lines = content.split('\n');
    const subtitles = [];
    let currentSub = {};
    
    // Very basic VTT parsing logic
    // WEBVTT
    //
    // 00:00:00.000 --> 00:00:05.000
    // Some text
    
    let isHeader = true;
    
    // Regex for timestamp: 00:00:00.000
    const timeRegex = /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === 'WEBVTT') continue;
        if (line === '') continue;

        const timeMatch = line.match(timeRegex);
        if (timeMatch) {
            if (currentSub.text) {
                subtitles.push(currentSub);
            }
            currentSub = {
                start: timeMatch[1],
                end: timeMatch[2],
                text: ''
            };
        } else if (currentSub.start) {
            // It's text
            // Remove formatting tags like <c> or <00:00:00>
            const cleanText = line.replace(/<[^>]*>/g, '');
            currentSub.text = currentSub.text ? currentSub.text + ' ' + cleanText : cleanText;
        }
    }
    if (currentSub.text) subtitles.push(currentSub);

    res.json({ raw: content, parsed: subtitles });

  } catch (error) {
    console.error('Error fetching subtitles:', error);
    res.status(500).json({ error: 'Failed to fetch subtitles' });
  }
});

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = `Summarize the following YouTube video transcript in a concise manner, highlighting key points:\n\n${text.substring(0, 30000)}`; // Limit char count for token limits
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

app.post('/api/search', async (req, res) => {
    const { text, query } = req.body;
    if (!text || !query) return res.status(400).json({ error: 'Text and query are required' });
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const prompt = `Based on the following video transcript, answer the user's question.\n\nTranscript:\n${text.substring(0, 30000)}\n\nQuestion: ${query}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();
      
      res.json({ answer });
    } catch (error) {
      console.error('Error searching:', error);
      res.status(500).json({ error: 'Failed to search content' });
    }
  });

// Catch-all handler for any request that doesn't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
