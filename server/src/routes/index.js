const express = require('express');
const youtubeRoutes = require('./youtube');
const aiRoutes = require('./ai');

const router = express.Router();

// Mount route modules
router.use('/', youtubeRoutes);
router.use('/', aiRoutes);

module.exports = router;
