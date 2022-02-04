const { body, validationResult } = require('express-validator')
const Post = require('../models/posts')
const Users = require('../models/users')
const Comment = require('../models/comments')

exports.createComment = [
  body('comment').trim().escape().isLength({min:1}).withMessage('You have left an empty comment'),
  body('username').trim().escape().isLength({min: 1}).withMessage('Add a username'),

  async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.json({
        errors: errors.array(),
        data: req.body
      })
    }
    try{
      const comment = new Comment ({
        comment: req.body.comment,
        user: req.body.username,
      })
      comment.save(err =>{
        if(err){
          return next(err)
        }
        res.status(200).json({message:'Comment saved', comment})
      })
      await Post.findOneAndUpdate(
        {_id: req.params.postid},
        {$push: {comments: comment}}
      )
    } catch (err){
      res.status(400).json({err})
    }
  }
];
