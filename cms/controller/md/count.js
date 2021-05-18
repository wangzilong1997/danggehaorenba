'use strict'

class count {

  constructor () {
    this.param = ''
  }

  async get (c) {
    
    let r = await c.service.mdcli.count(c.query.kwd || null, c.query.group || null)

    if (!r) {
      c.send('', 404)
      return
    }

    c.send(r)

  }
  

}

module.exports = count