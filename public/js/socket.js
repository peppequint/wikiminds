var socket = io()

socket.on('test', function(data) {
  console.log(data)
})

function upvote(id, userId) {
  socket.emit('upvote', { id: id, userId: userId })
}

socket.on('upvote', function(report) {
  console.log(report.success)
  commentScore = document.getElementById(report.comment)
  if (report.success) {
    commentScore.innerHTML = parseInt(commentScore.innerHTML) + 1
  } else if (!report.success) {
    alert('You already voted on this comment')
  }
})

function downvote(id, userId) {
  socket.emit('downvote', { id: id, userId: userId })
}

socket.on('downvote', function(report) {
  console.log(report.success)
  commentScore = document.getElementById(report.comment)
  if (report.success) {
    commentScore.innerHTML = parseInt(commentScore.innerHTML) - 1
  } else if (!report.success) {
    alert('You already voted on this comment')
  }
})

// $('form').submit(function(e) {
//   e.preventDefault() // prevents page reloading
//   var comment = {
//     issue: issue._id,
//     title: $('title').val(),
//     owner: 'test',
//     owner_name: 'test',
//     meta_description: $('meta_description').val()
//   }
//   socket.emit('comment', comment)
//   //   $('title').val('')
//   //   $('meta_description').val('')
//   //   return false
// })

// socket.on('comment', function(comment) {
//   console.log(comment)
//   //   $('#messages').append($('<li>').text(msg))
//   //   $('#chat-end')[0].scrollIntoView()
// })
