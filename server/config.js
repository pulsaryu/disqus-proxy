module.exports = {
  // 服务端端口，需要与disqus-proxy前端设置一致
  port: 3000,

  api_key: '5Q2Sxxk5WInPOlTllkJKdswsl7M4vtWiY0QrRKXIHtBeJl4YWPa0vbay49KFvQa6',
  // 你的diqus secret key
  api_secret: 'mfB2znq0vL6lZHfzrZYvXMzZtjAyrrpDz4Qt2bQQ27DDAoxEVIB3p3P807LGdNZu',

  // 你的disqus名称
  username: 'ciqu',

  // 服务端socks5代理转发，便于在本地测试，生产环境通常为null
  // socks5Proxy: {
  //   host: 'localhost',
  //   port: 1086
  // },

  socks5Proxy: null,

  // 日志输出位置,输出到文件或控制台 'file' | 'console'
  log: 'console'
}
