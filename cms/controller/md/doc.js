'use strict'

class doc {

  constructor () {
    this.param = '/*'
  }

  async get(c) {

    let r = await c.service.mdcli.get(c.param.starPath)

    if (!r) {
      c.send('', 404)
      return
    }

    c.setHeader('content-type', 'text/json; charset=utf-8')
    c.setHeader('content-encoding', 'gzip')
    c.send(r)
  }

}

module.exports = doc
