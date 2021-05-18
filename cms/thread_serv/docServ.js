'use strict'

const titbit = require('titbit')
const mdoc = require('../lib/mdoc')
const cfg = require('../config')

const app = new titbit({
  http2: true,
  useLimit: true,
  maxConn: 4650,
  timeout: 0,
  strong: true
})

let md = new mdoc(cfg.docOptions)

md.init().then(() => {
  md.initLecture()
})

/* console.log(md.fileinfo)
console.log(md.keyFile) */

app.get('/doc/*', async c => {
  let filename = decodeURIComponent(c.param.starPath)
  let data = md.getById(filename)
  if (!data) {
    c.send('not found', 404)
    return
  }
  c.setHeader('content-type', 'text/json; charset=utf-8')
  c.setHeader('content-encoding', 'gzip')
  c.send(data)
})

app.get('/group', async c => {
  c.send(md.group())
})

app.get('/search', async c => {
  let kstr = c.query.kwd
  let limit = (c.query.limit && !isNaN(c.query.limit)) ? parseInt(c.query.limit) : 0
  let offset = (c.query.offset && !isNaN(c.query.offset)) ? parseInt(c.query.offset) : 0
  let group = c.query.group || null

  if (offset < 0) {
    offset = 0
  }

  c.send(md.search(kstr, limit, offset, group))

})

app.get('/count', async c => {
  let kstr = c.query.kwd
  let group = c.query.group || null

  c.send({
    count: md.count(kstr, group)
  })

})

app.get('/lectures', async c => {
  c.send(md.lectures())
})

app.get('/lec/:id', async c => {
  let lec = md.getLecById(c.param.id)
  if (!lec) {
    c.send('not found', 404)
    return
  }

  c.send(lec)

})

app.get('/randget', async c => {
  let d = md.randget()
  if (d) {
    c.send(d)
    return
  }
  c.setHeader('content-type', 'text/json; charset=utf-8')
  c.setHeader('content-encoding', 'gzip')
  c.send('', 404)
})

//重新加载内容。
app.get('/reload', async c => {
  if (c.query.passkey !== 'reload-md-ok') {
    return
  }
  
  md.clear()
  md.init().then(() => {
    md.initLecture()
  })

})

app.run(11011, 'localhost')
