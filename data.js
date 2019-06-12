var Issue = require('./public/models/issue')
const twitterModule = require('./twitter')

function upload(req, res) {
  //Get the form data and call them user
  console.log(req.body)
  var issue = {
    title: req.body.title,
    meta_description: req.body.meta_description,
    description: req.body.description,
    upload: req.body.upload,
    category: req.body.category,
    votes: Math.floor(Math.random() * Math.floor(300)),
    popularity: 0
  }
  // check the popularity using twitter
  twitterModule.checkPopularity(req.body.category).then(popularity => {
    issue.popularity = popularity
    Issue.create(issue, function(err, newUser) {
      if (err) {
        res.send(err)
      }
      res.send('Issue ' + issue.title + ' has been added')
    })
  })
}

const handler = {
  getDetail: id => {
    return Issue.findOne({ _id: id }, issue => {
      return issue
    })
  },
  getIssues: () => {
    return Issue.find({}, issues => {
      return issues
    })
  }
}

//Export functions to be used in server.js
module.exports = {
  upload: upload,
  handler: handler
}
