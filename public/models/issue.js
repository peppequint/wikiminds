var mongoose = require('mongoose')
var IssueSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
})

var Issue = mongoose.model('Issue', IssueSchema)
module.exports = Issue
