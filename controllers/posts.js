const express = require('express');
const router = express.Router();
const Post = require('./../models/posts');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.getAll();
    res.render('posts/index', { posts: posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


//CREATE
router.get('/posts/create',  (req, res) => {
    res.render('posts/create')
});

router.post('/posts', async (req, res) =>{
    console.log(req.body.title);
    console.log(req.body.content);
    try{
        const title = req.body.title;
        const content = req.body.content;
        const post = new Post({title,content});
        await post.create();
        console.log('post created');
        console.log(post);

        res.redirect('/posts');
    }catch (err){
        console.log(err);
    }
});


//READ
//UPDATE
//DELETE
//Create a new post

