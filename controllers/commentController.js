const { body, validationResult } = require('express-validator')
const Post = require('../models/posts')
const Users = require('../models/users')
const Comment = require('../models/comments')

exports.allCommentsOnPost = async (req, res, next) => {
  try{
    let comments = await Comment.find({postId: req.params.postid},)
      .populate('user', {username: 1})

    return res.status(200).json(comments)
  }
  catch(err){
    return res.status(200).json({err: 'No comments'})
  }
};

exports.allComments = async (req, res, next) => {
  try{
    let comments= await Comment.find({});
    if (!comments){
      return res.status(404).json({message:'No comments'})
    }
    return res.status(200).json({comments})
  } catch(err){
    return next(err);
  }
}

exports.singleComment = async (req, res, next) => {
  try{
    let comment = await Comment.find({_id: req.params.commentid})
    if (!comment){
      return res.status(404).json({message: `No comment with ${req.params.commentid} found`})
    }
    return res.status(200).json({comment})
  } catch(err){
    return next(err);
  }
}

exports.deleteSingleComment = async (req, res, next) => {
  try{
    let comment = await Comment.findByIdAndDelete({_id: req.params.commentid})
    if (!comment){
      return res.status(404).json({message: `No comment with id ${req.params.commentid}`})
    }
    else {
    let deletedComment = await Post.findOneAndUpdate({
      _id: req.params.postid
    },
    {$pull: {
      comments: req.params.postid
      }
    }
  )
    return res.status(200).json({message: `Deleted comment with id ${req.params.commentid} and removed from ${req.params.postid}`, comment: comment, deletedComment})
  }
} catch(err){
  return next(err);
  }
};

exports.updateLike = async (req, res, next) =>{
  console.log(req.body.commentid)
  try{
    let commentToLike = await Comment.find({
      _id: req.body.commentid
    },
    {
      likeCount: 1,
      likes: {
        $elemMatch: { $eq: req.user._id}
      }
    }
  )
  console.log(commentToLike, "comment to like")
  if (commentToLike[0].likes === undefined || commentToLike[0].likes.length == 0 ){
    let result = await Comment.updateOne({
      _id: req.body.commentid,
      likes: {$ne : req.user._id}
    },
    {
      $inc: {likeCount: +1},
      $push: {likes: req.user._id}
    }
  )
  return res.status(200).json({result: result, comment: commentToLike})
} else {
  let result = await Comment.updateOne({
    _id: req.body.commentid,
    likes: req.user._id
  },
  {
    $inc: {likeCount: -1},
    $pull: {likes: req.user._id}
  }
)
return res.status(200).json({result: result, comment: commentToLike})
}
} catch(err){
  return res.status(400).json({err: err})
}
};

exports.createComment = [
  body('comment').trim().escape().isLength({min:1}).withMessage('You have left an empty comment'),

  async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({
        errors: errors.array(),
        data: req.body
      })
    }
    try{
      const comment = new Comment ({
        comment: req.body.comment,
        user: req.user._id,
        postId: req.params.postid
      })
      comment.save(err =>{
        if(err){
          res.status(400).json({err});
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
