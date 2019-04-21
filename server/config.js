module.exports = {
  // 服务端端口，需要与 disqus-proxy 前端设置一致, 如果你不确定就不要修改啦
  port: 5050,

  // disqus public key (到这里查看: https://disqus.com/api/applications/)
  api_key: '',

  // diqus secret key (到这里查看: https://disqus.com/api/applications/)
  api_secret: '',

  // 你的disqus名称
  username: 'szhshp',

  // 服务端 socks5 代理转发，便于在本地测试，生产环境通常为 null
  // socks5Proxy: {
  //   host: 'localhost',
  //   port: 1086
  // },

  socks5Proxy: null,

  // 日志输出位置,输出到文件或控制台 'file' | 'console'
  log: 'console'
}
