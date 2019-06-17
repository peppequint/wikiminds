var mongoose = require('mongoose')
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  city: {
    type: String
  },
  skills: {
    type: String
  }
})

var User = mongoose.model('User', UserSchema)
module.exports = User
