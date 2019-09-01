const superagent = require('superagent')
const cheerio = require('cheerio');

export  function fetch(params) {
  return superagent.get('http://192.168.0.106:3000/fetch')
      .query(params)
  
}
export function getScore(params) {
  return superagent.get('http://192.168.0.106:3000/score')
      .query(params)


}
