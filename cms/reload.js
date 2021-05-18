'use strict'

const {http2cli} = require('gohttp')

let hii = http2cli.connect('http://localhost:11011', {
  debug: true,
  timeout:5000
})

hii.get({
  path : '/reload?passkey=reload-md-ok',
  timeout: 1000
}).then(ret => {
  if (ret.ok) {
    console.log('OK')
  } else {
    console.log(ret.error)
  }
}).then(() => {
  hii.close()
})