var User = require('./public/models/user')
var bcrypt = require('bcrypt')

// registering a new user
function register(req, res) {
  // get the form data
  var user = req.body
  if (!req.body.username || !req.body.password) {
    return res.render('message', {
      message: 'The username/password fields can`t be empty',
      redirect: '/register'
    })
  }
  // check if the username already exists, and if thats the case tell the user.
  return User.findOne(
    {
      username: user.username
    },
    function(err, name) {
      if (name) {
        return res.render('message', {
          message:
            'The username "' +
            name.username +
            '" is taken, please try another username',
          redirect: '/register'
        })
      } else {
        // otherwise hash the password (auto generated salt and 5 iterations) and create a user with the input from the form
        user.password = bcrypt.hashSync(user.password, 5)
        // create user
        User.create(user, function(err, newUser) {
          if (err) {
            return res.render('message', {
              message: err,
              redirect: '/register'
            })
          }
          return res.render('message', {
            message: 'Your account ' + user.username + ' is now active!',
            redirect: '/login'
          })
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
  User.findOne(
    {
      username: username
    },
    function(err, result) {
      if (!result) {
        return res.render('message', {
          message:
            'The username "' +
            username +
            '" does not exist in our database, please try again',
          redirect: '/login'
        })
      } else {
        if (
          username === result.username &&
          bcrypt.compareSync(req.body.password, result.password)
        ) {
          req.session.userId = result._id
          return res.redirect('/')
        } else {
          return res.render('message', {
            message: 'Your username/password is incorrect, please try again',
            redirect: '/login'
          })
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
