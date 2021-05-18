'use strict'

class search {

  constructor () {
    this.param = ''
  }

  async get (c) {

    c.query.limit = 20

    let r = await c.service.mdcli.list(c.query)

    if (!r) {
      c.send('', 404)
      return
    }

    c.setHeader('content-type', 'text/json; charset=utf-8')
    c.send(r)

  }
  

}

module.exports = search