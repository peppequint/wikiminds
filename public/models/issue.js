var mongoose = require('mongoose')
var IssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  category: {
    type: String
  }
})

var Issue = mongoose.model('Issue', IssueSchema)
module.exports = Issue
