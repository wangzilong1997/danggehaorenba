'use strict'

class group {

  constructor () {
    this.param = ''
  }

  async get (c) {
    let r = await c.service.mdcli.group()

    if (!r) {
      c.send('', 404)
      return
    }
    
    c.send(r)
  }

}

module.exports = group
