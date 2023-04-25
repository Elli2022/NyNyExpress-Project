const express = require('express');
const router = express.Router();
const Post = require('./../models/posts');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.getAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;