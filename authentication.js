var User = require('./public/models/user')
var bcrypt = require('bcrypt')

// registering a new user
function register(req, res) {
  // get the form data
  var user = req.body
  if (!req.body.username || !req.body.password) {
    console.log('no username or password')
    return res.render('register')
  }
  // check if the username already exists, and if thats the case tell the user.
  return User.findOne(
    {
      username: user.username
    },
    function(err, name) {
      if (name) {
        res.send('The username ' + name.username + ' is taken!')
      } else {
        // otherwise hash the password (auto generated salt and 5 iterations) and create a user with the input from the form
        user.password = bcrypt.hashSync(user.password, 5)
        User.create(user, function(err, newUser) {
          if (err) {
            console.log(err)
            return res.render('register')
          }
          res.send('Account ' + user.username + ' is now active')
        })
      }
    }
  )
}

// login function
function login(req, res) {
  // take username from body
  var username = req.body.username

  // check if username exists and if it does check username and hash
  // TODO initiate a session to further track whether the user is logged in
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
          req.session.userId = result._id
          return res.redirect('/')
        } else {
          return res.redirect('login')
        }
      }
    }
  )
}

// export functions to be used in routes.js
module.exports = {
  register: register,
  login: login
}
