const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authentication = require('./authentication')
const data = require('./data')

var session = require('express-session')

const app = express()
const port = process.env.PORT || 3000

// initialize session
app.use(
  session({
    secret: 'wikiminds',
    resave: true,
    saveUninitialized: false
  })
)

// create a session object to check whether a user is logged in on all pages
app.use(function(req, res, next) {
  res.locals.session = req.session
  next()
})

// body parser for form data
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
// connect to MongoDB hosted by mlab
mongoose.connect(
  'mongodb://wikiminds:wikiminds1@ds233737.mlab.com:33737/wikiminds',
  { useNewUrlParser: true }
)

// define static folder
app.use(express.static('public'))

// view engine set up
app.set('view engine', 'ejs')
app.set('views', './public/views/pages')

// home route
app.get('/', (req, res) =>
  data.handler.getIssues().then(issues => res.render('index', { data: issues }))
)

// detail page route
app.get('/details/:id', (req, res) =>
  data.handler
    .getDetail(req.params.id)
    .then(issue => res.render('detail', { issue: issue }))
)

// profile routes
app.get('/profile', (req, res) => {
  if (req.session.userId) {
    res.render('profile')
  } else {
    res.render('login')
  }
})

// register
app.get('/register', (req, res) => res.render('register'))

// login
app.get('/login', (req, res) => res.render('login'))

// on logout
app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err)
      } else {
        return res.render('message', {
          message: 'You are now logged out',
          redirect: '/'
        })
      }
    })
  }
})

// route for new issues
app.get('/issue', (req, res) => res.render('issue'))

// 404
app.get('*', function(req, res) {
  res.status(404).render('404')
})

// post routes for form submissions
app.post('/register', authentication.register)
app.post('/login', authentication.login)
app.post('/newissue', data.upload)

app.listen(port, () => console.log(`Wikiminds listening on port ${port}!`))
