'use strict'

const {http2cli} = require('gohttp')

class docservcli {

  constructor () {
    
    this.host = 'http://localhost:11011'

    this.max = 10

    this.hs = null

  }

  init () {
    this.hs = http2cli.connectPool(this.host, {
      debug: true,
      keepalive: true,
      max : this.max,
      timeout: 0,
    })
  }

  async get (id) {
    let r = await this.hs.get({
      path : `/doc/${id}`,
      timeout: 1920
    })

    if (r.ok) {
      return r.blob()
    }

    return null
  }

  async randget () {
    let r = await this.hs.get({
      path : '/randget',
      timeout: 1920
    })

    if (r.ok) {
      return r.blob()
    }
    
    return null
  }

  async list (args) {
    let path = '/search?a=1'
    if (args.kwd) {
      path += `&kwd=${args.kwd}`
    }
    if (args.offset) {
      path += `&offset=${args.offset}`
    }

    if (args.limit) {
      path += `&limit=${args.limit}`
    }

    if (args.group) {
      path += `&group=${args.group}`
    }

    let r = await this.hs.get({
      path : path,
      timeout: 5000
    })

    if (r.ok) {
      return r.blob()
    }

    return null
  }

  async count (kstr = null, group = null) {
    let path = '/count?a=1'
    if (kstr) {
      path += `&kstr=${kstr}`
    }

    if (group) {
      path += `&group=${group}`
    }

    let r = await this.hs.get({
      path : path,
      timeout : 1920
    })

    if (r.ok) {
      return r.blob()
    }

    return null
  }

  async getLecture(id) {
    let r = await this.hs.get({
      path : `/lec/${id}`,
      timeout : 2000
    })

    if (r.ok) {
      return r.blob()
    }

    return null
  }

  async lectureList () {
    let r = await this.hs.get({
      path : `/lectures`,
      timeout : 1280
    })

    if (r.ok) {
      return r.blob()
    }

    return null

  }

  async group () {
    let r = await this.hs.get({
      path : `/group`,
      timeout : 1280
    })

    if (r.ok) {
      return r.blob()
    }

    return null

  }

  async reload () {
    let r = await this.hs.put({
      path : '/reload?passkey=reload-md-ok',
      timeout: 1000
    })

    if (r.ok) {
      return true
    }

    return false
  }

}

module.exports = docservcli
