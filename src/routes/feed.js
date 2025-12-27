const express = require('express');
const router = express.Router();

router.get('/feed', (req, res) => {
  res.json({
    site: process.env.SITE_URL,
    posts: []
  });
});

module.exports = router;
