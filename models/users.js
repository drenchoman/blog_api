var mongoose = require('mongoose');
var { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true, maxLength: 20},
  password: {type: String, required: true },
  admin: {type: Boolean, default: false},
  member:{type: Boolean, default: false},
  timeStamp: {type: Date, default: Date.now, required: true},
  posts:{type: Schema.Types.ObjectId, ref: 'Post'},
  comments:{type: Schema.Types.ObjectId, ref:'Comment'}
})

module.exports = mongoose.model('User', UserSchema);
