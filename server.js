const express = require('express')
const mongoose = require('mongoose')
var session = require('express-session')
const bodyParser = require('body-parser')
const authentication = require('./authentication')
const data = require('./data')

const http = require('http')

const app = express()

var server = http.createServer(app)

var io = require('socket.io').listen(server)
const port = process.env.PORT || 3000

const multer = require('multer')

// images
const cloudinary = require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')
require('dotenv').config()

// config for image upload
// https://www.freecodecamp.org/news/how-to-allow-users-to-upload-images-with-node-express-mongoose-and-cloudinary-84cefbdff1d9/
cloudinary.config({
  cloud_name: process.env.CLOUD_name,
  api_key: process.env.CLOUD_key,
  api_secret: process.env.CLOUD_secret
})

// image parsing
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'wikiminds',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
})

const parser = multer({ storage: storage })

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
mongoose.connect(process.env.DB_MONGOLINK, { useNewUrlParser: true })

// define static folder
app.use(express.static('public'))

// view engine set up
app.set('view engine', 'ejs')
app.set('views', './public/views/pages')

// home route
app.get('/', (req, res) =>
  data.handler.getIssues().then(issues => {
    res.render('index', { data: issues })
  })
)

// detail page route
app.get('/details/:id', (req, res) =>
  data.handler.getDetail(req.params.id).then(issue => {
    data.handler.getUser(issue.owner).then(user => {
      data.handler.getComments(issue._id).then(comments => {
        res.render('detail', { issue: issue, owner: user, comments: comments })
      })
    })
  })
)

// liking an issue
app.get('/details/:id/like', (req, res) => {
  if (req.session.userId) {
    data.handler.addLike(req.params.id, req.session.userId).then(issue => {
      if (issue) {
        res.render('message', {
          message: 'You favorited "' + issue.title + '".',
          redirect: '/details/' + issue._id
        })
      } else {
        res.render('message', {
          message:
            'You already favorited this post. To remove this post from your favorites, navigate to favorites in the menu',
          redirect: '/'
        })
      }
    })
  } else {
    res.render('message', {
      message: 'You need to be logged in to like an issue',
      redirect: '/login'
    })
  }
})

// removing an issue from likes
app.get('/details/:id/dislike', (req, res) => {
  if (req.session.userId) {
    data.handler.removeLike(req.params.id, req.session.userId).then(issue => {
      if (issue) {
        res.render('message', {
          message: 'You removed "' + issue.title + '" from your favorites',
          redirect: '/favorites'
        })
      } else {
        res.render('message', {
          message: 'Something went horribly wrong, please try again',
          redirect: '/'
        })
      }
    })
  } else {
    res.render('message', {
      message: 'You need to be logged in to favorite or remove an issue',
      redirect: '/login'
    })
  }
})

// fallback to upvote a comment when javascript is disabled
app.get('/comment/:id/upvote', (req, res) => {
  if (req.session.userId) {
    data.handler
      .upvoteComment(req.params.id, req.session.userId)
      .then(comment => {
        if (comment) {
          res.redirect('back')
        } else {
          console.log('comment already upvoted')
          res.redirect('back')
        }
      })
  } else {
    res.render('message', {
      message: 'You need to be logged in to upvote a comment',
      redirect: '/login'
    })
  }
})

// fallback to downvote a comment when javascript is disabled
app.get('/comment/:id/downvote', (req, res) => {
  if (req.session.userId) {
    data.handler
      .downvoteComment(req.params.id, req.session.userId)
      .then(comment => {
        if (comment) {
          res.redirect('back')
        } else {
          console.log('comment already downvoted')
          res.redirect('back')
        }
      })
  } else {
    res.render('message', {
      message: 'You need to be logged in to downvote a comment',
      redirect: '/login'
    })
  }
})

// delete issue
app.get('/delete/:id', (req, res) => {
  if (req.session.userId) {
    data.handler.deleteIssue(req.params.id, req.session.userId).then(issue => {
      if (issue) {
        res.render('message', {
          message: 'Issue with name "' + issue.title + '" has been deleted',
          redirect: '/'
        })
      } else {
        res.render('message', {
          message: 'Permission denied',
          redirect: '/'
        })
      }
    })
  } else {
    res.render('message', {
      message: 'You are not logged in',
      redirect: '/'
    })
  }
})

// profile routes
app.get('/profile', (req, res) => {
  if (req.session.userId) {
    data.handler.getUser(req.session.userId).then(user => {
      data.handler.getIssuesForUser(user._id).then(issues => {
        res.render('profile', { user: user, issues: issues })
      })
    })
  } else {
    res.redirect('/login')
  }
})

// detail page per user
app.get('/users/:id', (req, res) => {
  data.handler.getUser(req.params.id).then(user => {
    data.handler.getIssuesForUser(user._id).then(issues => {
      res.render('user', { user: user, issues: issues })
    })
  })
})

// get favorites for user
app.get('/favorites', (req, res) => {
  if (req.session.userId) {
    data.handler.getFavorites(req.session.userId).then(favorites => {
      res.render('favorites', { data: favorites })
    })
  } else {
    res.redirect('/login')
  }
})

// register
app.get('/register', (req, res) => res.render('register'))

// login
app.get('/login', (req, res) => {
  res.render('login')
})

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
app.get('/issue', (req, res) => {
  if (req.session.userId) {
    res.render('issue')
  } else {
    return res.render('message', {
      message: 'You need to be logged in to create an issue',
      redirect: '/'
    })
  }
})
// 404
app.get('*', function(req, res) {
  res.status(404).render('404')
})

// post routes for form submissions
app.post('/register', authentication.register)
app.post('/login', authentication.login)
app.post('/newissue', parser.single('upload'), data.upload)
app.post('/newcomment/:id', data.comment)

// socket.io for upvoting / downvoting

io.on('connection', function(socket) {
  console.log('User connected to socket')
  // upvote
  socket.on('upvote', function(upvote) {
    data.handler.upvoteComment(upvote.id, upvote.userId).then(comment => {
      if (comment) {
        console.log('"' + comment.title + '" upvoted.')
        socket.emit('upvote', { success: true, comment: comment._id })
      } else {
        console.log('Comment already upvoted.')
        socket.emit('upvote', { success: false, comment: upvote.id })
      }
    })
  })
  // downvote
  socket.on('downvote', function(downvote) {
    console.log('downvote ' + downvote.id)
    data.handler.downvoteComment(downvote.id, downvote.userId).then(comment => {
      if (comment) {
        console.log(comment.title + ' downvoted')
        socket.emit('downvote', { success: true, comment: comment._id })
      } else {
        console.log('comment already upvoted')
        socket.emit('downvote', { success: false, comment: downvote.id })
      }
    })
  })
})

server.listen(port, () => console.log(`Wikiminds listening on port ${port}!`))
