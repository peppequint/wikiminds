const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authentication = require('./authentication')
const data = require('./data')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
// connect to MongoDB
mongoose.connect(
  'mongodb://wikiminds:wikiminds1@ds233737.mlab.com:33737/wikiminds',
  { useNewUrlParser: true }
)

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', './public/views/pages')

app.get('/', (req, res) =>
  data.handler.getIssues().then(issues => res.render('index', { data: issues }))
)

app.get('/profile', (req, res) => res.render('profile'))

app.get('/register', (req, res) => res.render('register'))
app.get('/login', (req, res) => res.render('login'))

app.get('/issue', (req, res) => res.render('issue'))

app.get('/details/:id', (req, res) =>
  data.handler
    .getDetail(req.params.id)
    .then(issue => res.render('detail', { issue: issue }))
)

app.get('*', function(req, res) {
  res.status(404).render('404')
})

// post requests
app.post('/register', authentication.register)
app.post('/login', authentication.login)

app.post('/newissue', data.upload)

app.listen(port, () => console.log(`Wikiminds listening on port ${port}!`))
