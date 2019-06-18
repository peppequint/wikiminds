var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    trim: true
  },
  meta_description: {
    type: String
  },
  likes: [
    {
      type: String
    }
  ]
});

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
