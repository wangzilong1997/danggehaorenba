'use strict'

const fs = require('fs')

class image {

  constructor () {
    this.param = '/*'
  }

  async get (c) {
    let name = decodeURIComponent(c.param.starPath)
    let filename = `${c.service.docpath}/${name}`

    try {
      let sname = name.split('.')
      if (sname.length < 1) {
        c.send('', 400)
        return
      }

      let extname = sname[sname.length - 1].toLocaleLowerCase()

      switch (extname) {
        case 'jpg':
        case 'jpeg':
          c.setHeader('content-type', 'image/jpeg')
          break

        case 'png':
          c.setHeader('content-type', 'image/png')
          break
        
        case 'gif':
          c.setHeader('content-type', 'image/gif')
          break
        
        case 'webp':
          c.setHeader('content-type', 'image/webp')
          break

        case 'ico':
          c.setHeader('content-type', 'image/x-icon')
          break
      }
      
      c.setHeader('cache-control', 'max-age=3600')
      c.sendHeader()

      await new Promise((rv, rj) => {
        let stm = fs.createReadStream(filename)
        stm.pipe(c.reply)
        stm.on('error', err => {
          rj(err)
        })
        stm.on('end', () => {
          rv()
        })
      })
      
    } catch (err) {
      c.send('', 404)
    }
  }
  

}

module.exports = image