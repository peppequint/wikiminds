var Issue = require('./public/models/issue')
const twitterModule = require('./twitter')

// uploading a new issue
function upload(req, res) {
  // get the form data and refactor it to a standard issue format
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
    console.log(issue)
    // add the new issue to the database
    Issue.create(issue, function(err, newUser) {
      if (err) {
        res.send(err)
      }
      res.render('message', {
        message: issue.title + ' has been added',
        redirect: '/'
      })
    })
  })
}

// datahandler to get details/all issues
const handler = {
  // get a single issue
  getDetail: id => {
    return Issue.findOne({ _id: id }, issue => {
      return issue
    })
  },
  // retrieve all issues
  getIssues: () => {
    return Issue.find({}, issues => {
      return issues
    })
  }
}

// export functions to be used in server.js
module.exports = {
  upload: upload,
  handler: handler
}
