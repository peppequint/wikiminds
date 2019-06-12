const Twit = require('twit')

let areacode = 23424977
let q1 = 'environment'
let q2 = 'plastic'
let q3 = 'sealife'

// twitter keys
let T = new Twit({
  consumer_key: 'YFPrRu0ynMMj360eNC2jd91mS',
  consumer_secret: 'dnwqyvnXONB1ef129N6JRBSsvWZGKNGPK8kCiAIdImlY6dW8RU',
  access_token: '1118092957402456066-T3NGbV0yeWBjBMzMwdwaPhagjsuw9A',
  access_token_secret: 'unbxJzG1sZoQFMwKItp5Su5jk9wMwHIH3tPKhrdLEEwlY'
})

function checkPopularity(keyword) {
  return T.get('search/tweets', {
    q: keyword,
    count: 100,
    result_type: 'popular'
  }).then(result => {
    return result.data.statuses.length
    // return (tweetsWithVolume = result.data.filter(tweets => {
    //   console.log(tweets)
    // }))
  })
}

module.exports = {
  checkPopularity: checkPopularity
}
