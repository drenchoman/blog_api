var mongoose = require('mongoose');
let { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title:{type: String, required: true, minLength: 1, maxLength: 35},
  content:{type: String, required: true, minLength: 1},
  user:{type:Schema.Types.ObjectId, ref:'User', requried: true},
  comments:[{type:Schema.Types.ObjectId, ref:'Comment'}],
  timeStamp:{type: Date, default: Date.now, requried: true},
  published:{type:Boolean, default: false},
  likeCount:{type: Number, default: 0, },
  likes:[{type:Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Post', PostSchema);
