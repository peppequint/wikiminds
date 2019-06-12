var Issue = require('./public/models/issue')
var ObjectId = require('mongodb').ObjectID
function upload(req, res) {
  //Get the form data and call them user
  console.log(req.body)
  var issue = req.body

  Issue.create(issue, function(err, newUser) {
    if (err) {
      res.send(err)
    }
    res.send('Issue' + issue.title + ' has been added')
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

//handler.getDetail().then(value => console.log(value))

//Export functions to be used in server.js
module.exports = {
  upload: upload,
  handler: handler
}
