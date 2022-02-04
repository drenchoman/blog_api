var mongoose = require('mongoose');
var { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var CommentSchema = new Schema ({
  comment: {type: String, required: true, minLength: 1, maxLength: 250},
  user: {type: String, required: true},
  timeStamp:{type: Date, default: Date.now, required: true},
  likes:{type: Number, default: 0}
});

module.exports = mongoose.model('Comment', CommentSchema);
