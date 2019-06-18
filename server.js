const express = require('express');
const mongoose = require('mongoose');
var session = require('express-session');
const bodyParser = require('body-parser');
const authentication = require('./authentication');
const data = require('./data');

const app = express();
const port = process.env.PORT || 3000;

const multer = require('multer');

// images
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
require('dotenv').config();

// config for image upload
// https://www.freecodecamp.org/news/how-to-allow-users-to-upload-images-with-node-express-mongoose-and-cloudinary-84cefbdff1d9/
cloudinary.config({
  cloud_name: process.env.CLOUD_name,
  api_key: process.env.CLOUD_key,
  api_secret: process.env.CLOUD_secret
});

// image parsing
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'wikiminds',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
});

const parser = multer({ storage: storage });

// initialize session
app.use(
  session({
    secret: 'wikiminds',
    resave: true,
    saveUninitialized: false
  })
);

// create a session object to check whether a user is logged in on all pages
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// body parser for form data
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// connect to MongoDB hosted by mlab
mongoose.connect(process.env.DB_MONGOLINK, { useNewUrlParser: true });

// define static folder
app.use(express.static('public'));

// view engine set up
app.set('view engine', 'ejs');
app.set('views', './public/views/pages');

// home route
app.get('/', (req, res) =>
  data.handler.getIssues().then(issues => res.render('index', { data: issues }))
);

// detail page route
app.get('/details/:id', (req, res) =>
  data.handler.getDetail(req.params.id).then(issue => {
    data.handler.getUser(issue.owner).then(user => {
      res.render('detail', { issue: issue, owner: user });
    });
  })
);

// liking an issue
app.get('/details/:id/like', (req, res) => {
  if (req.session.userId) {
    data.handler.addLike(req.params.id, req.session.userId).then(issue => {
      if (issue) {
        res.render('message', {
          message: 'You liked ' + issue.title,
          redirect: '/details/' + issue._id
        });
      } else {
        res.render('message', {
          message: 'You already liked this post',
          redirect: '/'
        });
      }
    });
  } else {
    res.render('message', {
      message: 'You need to be logged in to like an issue',
      redirect: '/login'
    });
  }
});

// delete issue
app.get('/delete/:id', (req, res) => {
  if (req.session.userId) {
    data.handler.deleteIssue(req.params.id, req.session.userId).then(issue => {
      if (issue) {
        res.render('message', {
          message: 'Issue with name ' + issue.title + ' has been deleted',
          redirect: '/'
        });
      } else {
        res.render('message', {
          message: 'Permission denied',
          redirect: '/'
        });
      }
    });
  } else {
    res.render('message', {
      message: 'You are not logged in',
      redirect: '/'
    });
  }
});

// profile routes
app.get('/profile', (req, res) => {
  if (req.session.userId) {
    data.handler.getUser(req.session.userId).then(user => {
      data.handler.getIssuesForUser(user._id).then(issues => {
        res.render('profile', { user: user, issues: issues });
      });
    });
  } else {
    res.redirect('/login');
  }
});

// detail page per user
app.get('/users/:id', (req, res) => {
  data.handler.getUser(req.params.id).then(user => {
    data.handler.getIssuesForUser(user._id).then(issues => {
      res.render('user', { user: user, issues: issues });
    });
  });
});

// register
app.get('/register', (req, res) => res.render('register'));

// login
app.get('/login', (req, res) => res.render('login'));

// on logout
app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.render('message', {
          message: 'You are now logged out',
          redirect: '/'
        });
      }
    });
  }
});

// route for new issues
app.get('/issue', (req, res) => {
  if (req.session.userId) {
    res.render('issue');
  } else {
    return res.render('message', {
      message: 'You need to be logged in to create an issue',
      redirect: '/'
    });
  }
});
// 404
app.get('*', function(req, res) {
  res.status(404).render('404');
});

// post routes for form submissions
app.post('/register', authentication.register);
app.post('/login', authentication.login);
app.post('/newissue', parser.single('upload'), data.upload);
app.post('/newcomment', data.comment);

app.listen(port, () => console.log(`Wikiminds listening on port ${port}!`));
