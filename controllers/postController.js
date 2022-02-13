const { body, validationResult } = require('express-validator');
const Post = require('../models/posts');
const Users = require('../models/users');
const Comment = require('../models/comments');

exports.allPosts = async function (req, res, next){
  try{
    let posts = await Post.find({},{title: 1, content: 1, timeStamp: 1, })
    .populate('user', {username: 1, _id: 0})

    return res.status(200).json(posts)
  }
  catch(err){
    return res.status(200).json({message: 'No Posts'})
  }
};

exports.topPosts = async function (req, res, next){
  try{
    let posts = await Post.find({},{title: 1, content: 1, timeStamp: 1, likeCount: 1})
    .sort([['likeCount','descending']])
    .populate('user', {username: 1, _id: 0})
  return res.status(200).json(posts)
} catch(err){
  return res.status(200).json({message: 'No posts'})
}
};

exports.singlePost = async function (req, res, next){
  try{
    let post = await Post.find({_id: req.params.postid})
      .populate('user', {username: 1,})

    if (!post || post.length == 0){
      return res.status(404).json({message:'No post with id exists'})
    }
    return res.status(200).json({post})
  }
  catch(err){
    return res.json({message:'Post does not exist'})
    }
};

// Need to check if user is admin

exports.deleteSinglePost = async (req, res, next) => {
  try{
    if(req.user.admin){
      let post = await Post.findByIdAndDelete({_id: req.params.postid});
      if (!post){
        return res.status(404).json({err: `No posts with id ${req.params.postid} exists`});
      }
    // Remove comments with post ID
    let deletedComments = await Comment.deleteMany({postId: req.params.postid})
    res.status(200).json({message: `Post with id ${req.params.postid} deleted successfully`, comments: deletedComments});
  } else{
    return res.status(403).json({message:'You must be an admin to perform this action'})
  }
} catch (err){
    return next(err);
  }
}

exports.createPost = [
  body('title').trim().isLength({min:1}).withMessage('Add a title to your post!'),
  body('content').trim().isLength({min:1}).withMessage('Add content to your blog post'),

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

  exports.updateLike = async(req, res, next) =>{
    try{
      let userHasLiked = await Post.find({
        _id: req.body.postid
      },
      {
        likeCount: 1,
        likes:{
          $elemMatch: { $eq: req.user._id}
        }
      }
    )
    if (userHasLiked[0].likes === undefined || userHasLiked[0].likes.length === 0) {
      let result = await Post.updateOne({
        _id: req.params.postid,
        likes: {$ne : req.user._id }
      },
      {
        $inc: {likeCount: 1},
        $push:{likes: req.user._id}
      }
    )
    return res.json({result: result, post: userHasLiked});
  } else {
    let result = await Post.updateOne({
      _id: req.params.postid,
      likes: req.user._id
    },
    {
      $inc: {likeCount: -1},
      $pull: {likes: req.user._id}
    }
  )
  return res.json({result: result, post: userHasLiked});
  }

  } catch(err){
    return res.json({err: err})
  }
};
