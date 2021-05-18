'use strict'

class top {

  constructor () {
    this.param = ''
  }

  async get(c) {

    //必须有top模型，并实现getContent接口。
    if (!c.service.model || !c.service.model.top || !c.service.model.top.getContent 
      || typeof c.service.model.top.getContent !== 'function') 
    {
      c.send('', 404)
      return
    }

    let r = await c.service.model.top.getContent()

    if (!r) {
      c.send('', 404)
      return
    }
    
    c.send(r)
  }

}

module.exports = top
