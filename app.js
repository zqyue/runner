const express = require('express');
const superagent = require('superagent')
const cheerio = require('cheerio');

var app = express();
app.get('/fetch', dealParams, fetchData, getScore);
app.listen(3000, function () {

});

function dealParams(req, res, next) {
  console.log('dealparams---')
  let query = req.query
  if (!query.surname || !query.name) {
    res.send('参数格式不正确！');
    res.end()
    return
  }
  req.fetchQuery=query
  next()
}
console.log('test')
function fetchData(req, res, next) {
  console.log('fetchdata---')

  fetch(req.fetchQuery).end((err, res1) => {

    if (err) {
      res.send('数据获取失败！');
      res.end()
      return
    }
    // console.log(res.text)
    let $ = cheerio.load(res1.text);

    let arr = []
    $('.fc').each((index, ele) => {
      let id = $(ele).attr('id')
      arr.push({
        url: $(ele).data('url'),
        title: $('#' + id + ' .tit').text(),
        info: $('#' + id + ' .info').text()
      })
    })

    if (arr.length !== 1) {
      res.send(arr);
      res.end()
      return
    }
    req.infoUrl='https://itra.run' + arr[0].url
    next()
  })
}
function getScore(req, res) {
  console.log('getscore---')
  superagent.get(req.infoUrl).end((err, res1) => {
    if (err) {
      res.send('详情页获取失败！');
      res.end()
      return
    }
    let $ = cheerio.load(res1.text);
    let score = $('tr:first-child b:first-child ').text()
    res.send(score)
  })
}
function fetch(params) {
  return superagent.post('https://itra.run/fiche.php')
      .type('form')
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36')
      .set('Referer', 'https://itra.run/community/')
      .set('Host', 'itra.run')
      .set('Origin', 'https://itra.run')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        pnom: params.name,
        nat: 'CHN',
        mode: 'search',
        nom: params.surname,
      })
}


