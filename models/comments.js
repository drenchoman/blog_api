var mongoose = require('mongoose');
var { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var CommentSchema = new Schema ({
  comment: {type: String, required: true, minLength: 1, maxLength: 250},
  user: {type:Schema.Types.ObjectId, ref:'User'},
  postId:{type:Schema.Types.ObjectId, ref:'Post'},
  timeStamp:{type: Date, default: Date.now, required: true},
  likeCount:{type: Number, default: 0},
  likes:[{type:Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Comment', CommentSchema);
