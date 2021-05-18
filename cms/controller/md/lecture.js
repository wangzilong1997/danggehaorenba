'use strict'

class lecture {

  constructor () {
    
  }

  async get (c) {
    let r = await c.service.mdcli.getLecture(c.param.id)

    if (!r) {
      c.send('', 404)
      return
    }
    
    c.send(r)
  }

  async list (c) {
    let r = await c.service.mdcli.lectureList()

    if (!r) {
      c.send('', 404)
      return
    }

    c.send(r)

  }

}

module.exports = lecture
