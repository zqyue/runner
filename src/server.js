var express = require('express');
const sa = require('superagent')
const cheerio = require('cheerio');
var app = express();

app.get('/fetch', function (req, res) {
  let query = req.query
  if (!query.surname || !query.name) {
    res.send('参数格式不正确！');
    res.end()
    return
  }
  console.log('fetch-----')
  fetch(query).end((err, res1) => {
      if(err){
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
    res.send(arr);
  })
});
app.listen(3000, function () {
  
});

function fetch(params) {
  return sa.post('https://itra.run/fiche.php')
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