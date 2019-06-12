const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const issues = require('./public/src/data/issues.json')

const Twit = require('twit')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authentication = require('./authentication')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
// connect to MongoDB
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

app.get('/issue', (req, res) => res.render('issue'))

app.get('/details/:id', (req, res) =>
  res.render('detail', {
    data: issues.issues.find(issue => issue._id === req.params.id)
  })
)

//
// app.get('*', function(req, res) {
//   res.status(404).render('pages/404')
// })

// post requests
app.post('/register', authentication.register)
app.post('/login', authentication.login)

let areacode = 23424977
let q1 = 'environment'
let q2 = 'plastic'
let q3 = 'sealife'

// twitter keys
let T = new Twit({
  consumer_key: 'YFPrRu0ynMMj360eNC2jd91mS',
  consumer_secret: 'dnwqyvnXONB1ef129N6JRBSsvWZGKNGPK8kCiAIdImlY6dW8RU',
  access_token: '1118092957402456066-T3NGbV0yeWBjBMzMwdwaPhagjsuw9A',
  access_token_secret: 'unbxJzG1sZoQFMwKItp5Su5jk9wMwHIH3tPKhrdLEEwlY'
})

function getTrends(areacode) {
  return T.get('search/tweets', {
    q: q2,
    count: 100,
    result_type: 'popular'
  }).then(result => {
    console.log(result.data.statuses.length)
    // return (tweetsWithVolume = result.data.filter(tweets => {
    //   console.log(tweets)
    // }))
  })
}

getTrends(areacode)

app.listen(port, () => console.log(`Wikiminds listening on port ${port}!`))
