const express = require('express');
const { searchImages } = require('../services/pinterest');

const router = express.Router();

/**
 * GET /api/images/search?q=...&limit=12
 * Returns list of images found for the query
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 12 } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required.' });
    }

    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const results = await searchImages(q, parsedLimit);

    return res.json({
      query: q,
      count: results.length,
      results
    });
  } catch (err) {
    console.error('Error in /api/images/search', err);
    return res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
