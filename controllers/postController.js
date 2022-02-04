const { body, validationResult } = require('express-validator')
const Post = require('../models/posts')
const Users = require('../models/users')

exports.allPosts = async function (req, res, next){
  try{
    let posts = await Post.find({})
      
    return res.status(200).json(posts)
  }
  catch(err){
    return res.status(200).json({message: 'No Posts'})
  }
};

exports.singlePost = async function (req, res, next){
  try{
    let post = await Post.find({_id: req.params.postid})
      .populate({
        path: 'comments',
        model: 'Comment'
      });
    return res.status(200).json({post})
  }
  catch(err){
    return res.json('Post doe not exist')
  }
};

exports.createPost = [
  body('title').trim().escape().isLength({min:1}).withMessage('Add a title to your post!'),
  body('content').trim().escape().isLength({min:1}).withMessage('Add content to your blog post'),

  async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.json({
        errors: errors.array(),
        data: req.body
      })
    }
    try {
      const post = new Post ({
        title: req.body.title,
        content: req.body.content,
        user: req.user._id,
        })
        post.save(err =>{
          if (err){
            return next(err)
          }
          console.log('message saved')
          res.status(200).json({post, token: req.user})
        })
          await Users.findOneAndUpdate(
            {_id: post.user},
            {$push: {posts: post}}
          )
        } catch(err){
          res.status(400).json({err})
        }
      }
      ];
