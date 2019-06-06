var User = require('./public/models/user')
var bcrypt = require('bcrypt')
var multer = require('multer')

function register(req, res) {
  //Get the form data and call them user
  console.log(req.body.username)
  var user = req.body
  //Check if the username already exists, and if thats the case tell the user.
  return User.findOne(
    {
      username: user.username
    },
    function(err, name) {
      if (name) {
        res.send('The username ' + name.username + ' is taken!')
      } else {
        //Otherwise hash the password (auto generated salt and 5 iterations) and create a user with the input from the form
        user.password = bcrypt.hashSync(user.password, 5)
        User.create(user, function(err, newUser) {
          if (err) {
            res.send(err)
          }
          res.send('Account ' + user.username + ' is now active')
        })
      }
    }
  )
}

//Login function
function login(req, res) {
  //Take username from body
  var username = req.body.username

  //Check if username exists and if it does check username and hash
  //Also initiate a session to further track whether the user is logged in
  User.findOne(
    {
      username: username
    },
    function(err, result) {
      if (!result) {
        res.send('The username ' + username + ' does not exist')
      } else {
        if (
          username === result.username &&
          bcrypt.compareSync(req.body.password, result.password)
        ) {
          res.send('login correct')
          //return res.redirect('/')
        } else {
          res.send('Wrong password')
        }
      }
    }
  )
}

//Export functions to be used in routes.js
module.exports = {
  register: register,
  login: login
}
