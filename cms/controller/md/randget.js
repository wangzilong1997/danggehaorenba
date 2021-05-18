'use strict'

class count {

  constructor () {
    this.param = ''
  }

  async get (c) {
    
    let r = await c.service.mdcli.randget()

    if (!r) {
      c.send('', 404)
      return
    }

    c.setHeader('content-type', 'text/json; charset=utf-8')
    c.setHeader('content-encoding', 'gzip')

    c.send(r)

  }
  

}

module.exports = count