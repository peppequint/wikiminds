const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', './public/views/pages')

app.get('/', (req, res) => res.render('index'))

app.get('/profile', (req, res) => res.render('profile'))

app.get('/details/:id', (req, res) =>
  res.render('detail', { id: req.params.id })
)
//
// app.get('*', function(req, res) {
//   res.status(404).render('pages/404')
// })

app.listen(port, () => console.log(`Wikiminds listening on port ${port}!`))
