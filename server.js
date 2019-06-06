const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const issues = require('./public/src/data/issues.json')
app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', './public/views/pages')

app.get('/', (req, res) => res.render('index', { data: issues }))

app.get('/profile', (req, res) => res.render('profile'))

app.get('/details/:id', (req, res) =>
  res.render('detail', { id: req.params.id })
)
//
// app.get('*', function(req, res) {
//   res.status(404).render('pages/404')
// })

app.listen(port, () => console.log(`Wikiminds listening on port ${port}!`))
