'use strict'

const {cors} = require('titbit-toolkit')
const config = require('../config')

let cr = new cors({
  useOrigin: false,
  methods : ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allow: config.corsAllow,

  //allow: '*',
  allowHeaders : 'authorization,content-type,x-refresh-token',

  optionsCache: 'public, max-age=1800',

  //access-control-allow-credentials不能与access-control-allow-headers共存
})

let crtest = new cors({
  useOrigin: false,
  methods : ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  
  allow: '*',
  
  allowHeaders : 'authorization,content-type,x-refresh-token',

  optionsCache: 'public, max-age=30',

})

module.exports = [
  {
    middleware : cr.mid(),
    pre: true,
    mode: 'online'
  },

  {
    middleware : crtest.mid(),
    pre: true,
    mode: 'test'
  },

  /**
   * 需要会话验证的分组，也会让OPTIONS请求返回403，导致错误。
   * 这里先检测，如果是OPTIONS则无需继续执行。
   */

  {
    pre: true,
    middleware: async (c, next) => {
      if (c.method === 'OPTIONS') {
        return
      }
      await next()
    }
  }
]
