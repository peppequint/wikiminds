var mongoose = require('mongoose')
var CommentSchema = new mongoose.Schema({
  issue: {
    type: String
  },
  title: {
    type: String,
    trim: true
  },
  owner: {
    type: String,
    trim: true
  },
  owner_name: {
    type: String
  },
  meta_description: {
    type: String
  },
  likes: [
    {
      type: String
    }
  ],
  dislikes: [
    {
      type: String
    }
  ]
})

var Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment
