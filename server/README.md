# Disqus-Proxy - Server

## API

- 获取所有文章
  - GET `http://localhost:5050/api/getThreads`
- 获取所有评论
  - GET `http://localhost:5050/api/listPosts`
- 获取特定文章评论
  - GET `http://localhost:5050/api/getComments`
  - 参数: 
    - identifier: 文章 Indent, 这里一般就是网址
- 添加评论 
  - POST ``
  - 参数:
    - author_email: 邮箱名
    - author_name: 用户名
    - message: 正文内容
    - parent: null 或者 parent 评论的 ID
    - thread: 文章 ID, 注意这里不是 Ident, 只接受纯数字

## Server Deployment

1. 安装依赖
    
```
npm i --production
// 或者
yarn install --production
```
 
3. 配置 server 目录下的config.js
    
```js
module.exports = {
    // 服务端端口，需要与 disqus-proxy 前端设置一致
    port: 5509,
    // 你的 diqus secret key
    api_secret: 'your secret key',
    // 你的 disqus 名称，就是forum名称
    username:'ciqu',
    // 服务端 socks5 代理转发，便于在本地测试，生产环境通常为 null
    socks5Proxy: null,
    // 日志输出位置, 输出到文件或控制台 'file' | 'console'
    log: 'console'
}
```

api secret key 需要在 [Disqus 的 API 页面](https://disqus.com/api/applications/)申请

另外需要到`Settings => Community` 里开启访客评论

4. 启动服务

```
cd server
node index.js
```

> 正常运行服务，关闭 ssh 的时候就会关闭服务器，因此可以考虑使用 forever 插件

5. 让服务跟随服务器自动启动  

>#### Forever 的使用
>
>安装见官方Repo: [    https://github.com/foreverjs/forever   ](https://github.com/foreverjs/forever)
>
>
>很简单，只需要学会启动和关闭两个命令即可。
>
>```
>forever start app.js
>forever stopall
>```
>
>#### 服务器自动启动
>
>参考另一篇文章:  [优雅地乱玩Linux-7-Cron实现程序自启动](http://szhshp.org/tech/2017/08/26/croninlinux.html)


## Debug

本地运行的条件是 **本地已经可以访问 Disqus**, 因此建议挂载到 VPS 进行 FTP 连接调试.

进入 `\server` 执行:

```
npm install
nodemon index.js
```

即可开启调试.

确认开启服务端之后到浏览器输入 `http://localhost:5050/api/listPosts` 应该会显示所有评论数据
