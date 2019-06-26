var Comment = require('./public/models/comment')
var Issue = require('./public/models/issue')
var User = require('./public/models/user')
const twitterModule = require('./twitter')

// uploading a new issue
function upload(req, res) {
  // check if an image is uploaded
  var image
  if (req.file) {
    image = req.file.url
  } else {
    image = '/src/img/test-image.jpg'
  }
  // get the form data and refactor it to a standard issue format
  var issue = {
    title: req.body.title,
    owner: req.session.userId,
    meta_description: req.body.meta_description,
    description: req.body.description,
    upload: req.body.upload,
    category: req.body.category,
    votes: Math.floor(Math.random() * Math.floor(300)),
    popularity: 0,
    image: image
  }
  // check the popularity using twitter
  twitterModule.checkPopularity(req.body.category).then(popularity => {
    issue.popularity = popularity
    // add the new issue to the database
    Issue.create(issue, function(err, newUser) {
      if (err) {
        res.send(err)
      }
      res.render('message', {
        message: '"' + issue.title + '" has been added',
        redirect: '/'
      })
    })
  })
}

function comment(req, res) {
  if (req.session.userId) {
    handler.getUser(req.session.userId).then(user => {
      console.log(user)

      var comment = {
        issue: req.params.id,
        title: req.body.title,
        owner: user._id,
        owner_name: user.username,
        meta_description: req.body.meta_description,
        category: req.body.category
      }

      Comment.create(comment, function(err, newUser) {
        if (err) {
          res.send(err)
        }
        res.render('message', {
          message: '"' + comment.title + '" has been added',
          redirect: '/details/' + req.params.id + '#comment'
        })
      })
    })
  } else {
    res.render('message', {
      message: 'You can only comment when logged in',
      redirect: '/'
    })
  }
}

// datahandler to get details/all issues
const handler = {
  // get a single issue
  getDetail: id => {
    return Issue.findOne({ _id: id })
  },
  // get a single user
  getUser: id => {
    return User.findOne({ _id: id })
  },
  // retrieve all issues
  getIssues: () => {
    return Issue.find({})
  },
  // retrieve issues posted by certain user
  getIssuesForUser: id => {
    return Issue.find({ owner: id })
  },
  // get favorites for a user
  getFavorites: id => {
    return Issue.find({ likes: { $in: [id] } })
  },
  // delete an issue
  deleteIssue: (issueId, ownerId) => {
    return Issue.findOneAndRemove({ _id: issueId, owner: ownerId })
  },
  // like an issue
  addLike: (issueId, userId) => {
    return Issue.findOneAndUpdate(
      { _id: issueId, likes: { $ne: userId } },
      { $push: { likes: userId } }
    )
  },
  // remove issue from likes
  removeLike: (issueId, userId) => {
    return Issue.findOneAndUpdate(
      { _id: issueId },
      { $pull: { likes: userId } }
    )
  },
  // upvote a comment
  upvoteComment: (commentId, userId) => {
    return Comment.findOneAndUpdate(
      { _id: commentId, likes: { $ne: userId }, dislikes: { $ne: userId } },
      { $push: { likes: userId } }
    )
  },
  // downvote a comment
  downvoteComment: (commentId, userId) => {
    return Comment.findOneAndUpdate(
      { _id: commentId, likes: { $ne: userId }, dislikes: { $ne: userId } },
      { $push: { dislikes: userId } }
    )
  },
  // get comments for a issue
  getComments: issueId => {
    return Comment.find({ issue: issueId })
  }
}

// export functions to be used in server.js
module.exports = {
  upload: upload,
  handler: handler,
  comment: comment
}
