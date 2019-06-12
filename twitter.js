const Twit = require('twit')

// testing vars
let areacode = 23424977
let q1 = 'environment'
let q2 = 'society'
let q3 = 'politics'

// twitter keys
let T = new Twit({
  consumer_key: 'YFPrRu0ynMMj360eNC2jd91mS',
  consumer_secret: 'dnwqyvnXONB1ef129N6JRBSsvWZGKNGPK8kCiAIdImlY6dW8RU',
  access_token: '1118092957402456066-T3NGbV0yeWBjBMzMwdwaPhagjsuw9A',
  access_token_secret: 'unbxJzG1sZoQFMwKItp5Su5jk9wMwHIH3tPKhrdLEEwlY'
})

// function to determine twitter relevance of a certrain keyword
function checkPopularity(keyword) {
  return T.get('search/tweets', {
    q: keyword,
    count: 100,
    result_type: 'popular'
  }).then(result => {
    return result.data.statuses.length
  })
}

checkPopularity(q1).then(value => console.log('env ' + value))
checkPopularity(q2).then(value => console.log('society ' + value))
checkPopularity(q3).then(value => console.log('politics ' + value))

module.exports = {
  checkPopularity: checkPopularity
}
