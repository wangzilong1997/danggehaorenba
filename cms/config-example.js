'use strict'

module.exports = {

  //http模式：http1，http2，httpc
  //httpc是兼容模式，利用ALPN协议实现HTTP/2 和 HTTP/1.1 的兼容。
  httpMode: 'http1',

  //允许跨域请求的域名，如果需要指定，则使用数组
  /**
   * [
   *  'http://a.com',
   *  'https://x.com'
   * ]
   */
  corsAllow : '*',

  port: 1101,

  host: '0.0.0.0',

  worker: 2,

  maxWorker: 5,

  apiLimit: {
    unitTime: 2,
    maxIPRequest: 75
  },

  tokenKey: '',
  tokenIv : '',

  cert : '',

  key : '',

  //rt模块数据库配置
  dbconfig : {
    database : '',
    user : '',
    password : '',
    host : '127.0.0.1',
    max : 8
  },

  //如果设置为一个函数，则会执行此函数，并把已经初始化的app实例传递过去。
  initcall : null,

  docOptions : {
    //文档路径
    docpath : '',

    //默认作者名
    author : '',

    // \n\n 解析成 <br>
    parsetn : true,

    //是否需要在img的src路径后加上查询字符串，不能是?开头，这个会自动带上。
    imgqs : '',

    maxSize : 51200,

    domain : '',

    grpLevel : 0,

    pstyle: 'margin-top:0.2rem;margin-bottom:0.2rem;'

  }

}
