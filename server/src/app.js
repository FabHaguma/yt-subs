const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

console.log('Loading config...');
const config = require('./config');
console.log('Config loaded:', config);

console.log('Loading routes...');
const routes = require('./routes');
console.log('Routes loaded');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api', routes);

// Serve static files from the React client (for production)
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  
  // Catch-all handler for client-side routing (Express 5 syntax)
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Development mode - no static files
  app.get('/', (req, res) => {
    res.json({ 
      message: 'YT Subs API Server',
      endpoints: {
        health: '/api/health',
        metadata: 'POST /api/metadata',
        languages: 'POST /api/languages',
        subtitles: 'POST /api/subtitles',
        download: 'POST /api/download or GET /api/download'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Health check: http://localhost:${config.port}/api/health`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

module.exports = app;
