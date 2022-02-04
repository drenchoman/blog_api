const { body, validationResult } = require('express-validator')
const Post = require('../models/posts')

exports.allPosts = async function (req, res, next){
  res.json({message:"Get all posts"})
};

exports.singlePost = async function (req, res, next){
  res.json({message:"get single post"})
};

exports.createPost = async function (req, res, next){
  res.json({message: 'create post'})
};

// exports.postBlog = [
//   body('title').trim().isLength({min:1}).withMessage('Add a title to your post!'),
//   body('content').trim().isLength({min:1}).withMessage('Add content to your blog post'),
//
//   async (req, res, next) => {
//     const errors = validationResult(req)
//   if(!errors.isEmpty()){
//     console.log('error', errors)
//     return next(err);
//   }
//   try {
//     const post = new Post ({
//       title: req.body.title,
//       content: req.body.content,
//       user:
//
//     })
//   }
// ]
