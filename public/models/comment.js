var mongoose = require("mongoose");
var CommentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  }
});

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
