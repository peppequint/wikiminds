const Twit = require('twit')
require('dotenv').config()

// testing vars
let areacode = 23424977
let q1 = 'environment'
let q2 = 'society'
let q3 = 'politics'

// twitter keys
let T = new Twit({
  consumer_key: process.env.DB_consumer_key,
  consumer_secret: process.env.DB_consumer_secret,
  access_token: process.env.DB_access_token,
  access_token_secret: process.env.DB_access_token_secret
})

// function to determine twitter relevance of a certain keyword
function checkPopularity(keyword) {
  return T.get('search/tweets', {
    q: keyword,
    count: 100,
    result_type: 'popular'
  }).then(result => {
    return result.data.statuses.length
  })
}

// checkPopularity(q1).then(value => console.log('env ' + value))
// checkPopularity(q2).then(value => console.log('society ' + value))
// checkPopularity(q3).then(value => console.log('politics ' + value))

module.exports = {
  checkPopularity: checkPopularity
}
