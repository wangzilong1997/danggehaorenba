'use strict'

process.chdir(__dirname)

const cluster = require('cluster')
const fs = require('fs')
const titbit = require('titbit')
const titloader = require('titbit-loader')
const httpc = require('titbit-httpc')

if (cluster.isMaster) {
  try {
    fs.accessSync('./config.js')
  } catch (err) {
    fs.copyFileSync('./config-example.js', './config.js')
    console.error('首次运行，请打开config.js进行配置，然后再启动服务。')
    process.exit(0)
  }

  function try_mkdir(dirname) {
    try {
      fs.accessSync(dirname)
    } catch(err) {
      fs.mkdirSync(dirname)
    }
  }
  
  try_mkdir('./tmp')
  try_mkdir('./data')
  try_mkdir('./tmp/logs')
  
}

//const {http2cli} = require('gohttp')
const runWorkerThread = require('./lib/workerThread')
const wkthread = require('worker_threads')
const initEvent = require('./lib/initEvent.js')
const cfg = require('./config.js')
const options = require('./lib/initOptions.js')
const docServClient = require('./thread_serv/docServClient')
const config = require('./config.js')

if (cfg.port !== options.port) {
  cfg.port = options.port
}

let loadinfofile = '/tmp/mdloadinfo.log'

if (process.platform.indexOf('win') === 0) {
  loadinfofile = './tmp/mdloadinfo.log'
}

if (!config.apiLimit || config.apiLimit.toString() !== '[object Object]') {
  config.apiLimit = {
    unitTime: 2,
    maxIPRequest: 75
  }
}

let _http_mode = options.httpMode || config.httpMode

if (_http_mode === 'http2') {
  options.server.peerMaxConcurrentStreams = 50
  options.server.settings = {
    maxConcurrentStreams : 50,
    maxHeaderListSize : 16368,
  }
}

const app = new titbit({
  debug: options.debug,
  http2: _http_mode === 'http2' ? true : false,
  
  useLimit: true,
  maxConn: 1280,
  unitTime: config.apiLimit.unitTime || 2,
  maxIPRequest: config.apiLimit.maxIPRequest || 75,

  loadInfoFile: loadinfofile,
  loadInfoType : options.loadType,

  globalLog: true,
  logType: options.logType,
  logFile: `${options.logDir}/success.log`,
  errorLogFile: `${options.logDir}/error.log`,

  timeout: 6180,

  monitorTimeSlice: 592,

  //多个同名的URL参数不解析为数组
  fastParseQuery: true,

  //不自动decodeURIComponent
  autoDecodeQuery: false,
  
  cert: cfg.cert,
  key : cfg.key,
  server : options.server,

  strong: true
})

if (_http_mode === 'httpc') {
  if (!app.config.cert || !app.config.key) {
    console.error('兼容HTTP/2和HTTP/1.1需要开启HTTPS，请设置证书和密钥路径。')
    process.exit(1)
  }

  app.config.https = true

  ;(new httpc()).init(app)

}

app.service.TEST = false

if (options.test) {
  app.service.TEST = true
}

if (cluster.isWorker) {
  let tbl = new titloader({
    loadModel: false,
  })

  tbl.init(app)

  app.addService('config', config)
  let mdcli = new docServClient()

  setTimeout(() => {
    mdcli.init()
  }, 1000)
  
  app.addService('mdcli', mdcli)

  app.addService('docpath', config.docOptions.docpath)

  app.addService('appDir', __dirname)
}

if (cluster.isMaster && wkthread.isMainThread) {
  runWorkerThread(__dirname+'/thread_serv/docServ.js')
}

if (cluster.isWorker) {
  app.options('/*', async c => {})
}

initEvent(app)

if (typeof cfg.initcall === 'function') {
  cfg.initcall(app, cluster)
}

app.daemon(cfg.port, cfg.host, cfg.worker)
