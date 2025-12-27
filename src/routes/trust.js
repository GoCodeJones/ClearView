const express = require('express');
const router = express.Router();

router.get('/trust', (req, res) => {
  res.json({
    name: process.env.SITE_NAME,
    site: process.env.SITE_URL,
    feed: `${process.env.SITE_URL}/feed`,
    id: process.env.SITE_ID
  });
});

module.exports = router;
