const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api', routes);

// Serve static files from the React client (for production)
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Catch-all handler for client-side routing (Express 5 syntax)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
