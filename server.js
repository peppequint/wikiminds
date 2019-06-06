const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const issues = require('./public/src/data/issues.json')

var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var authentication = require('./authentication')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
//connect to MongoDB
mongoose.connect(
  'mongodb://wikiminds:wikiminds1@ds233737.mlab.com:33737/wikiminds'
)

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', './public/views/pages')

app.get('/', (req, res) => res.render('index', { data: issues }))

app.get('/profile', (req, res) => res.render('profile'))

app.get('/register', (req, res) => res.render('register'))
app.get('/login', (req, res) => res.render('login'))

app.get('/details/:id', (req, res) =>
  res.render('detail', {
    data: issues.issues.find(issue => issue._id === req.params.id)
  })
)

//
// app.get('*', function(req, res) {
//   res.status(404).render('pages/404')
// })

//Post requests
app.post('/register', authentication.register)
app.post('/login', authentication.login)

app.listen(port, () => console.log(`Wikiminds listening on port ${port}!`))
