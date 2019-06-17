var mongoose = require('mongoose')
var IssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  meta_description: {
    type: String
  },
  upload: {
    type: String
  },
  category: {
    type: String
  },
  votes: {
    type: String
  },
  likes: [
    {
      type: String
    }
  ],
  popularity: {
    type: String
  }
})

var Issue = mongoose.model('Issue', IssueSchema)
module.exports = Issue
