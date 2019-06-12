var Issue = require('./public/models/issue')

function upload(req, res) {
  //Get the form data and call them user
  console.log(req.body)
  var issue = req.body

  Issue.create(issue, function(err, newUser) {
    if (err) {
      res.send(err)
    }
    res.send('Account ' + issue.title + ' is now active')
  })
}

//Export functions to be used in routes.js
module.exports = {
  upload: upload
}
