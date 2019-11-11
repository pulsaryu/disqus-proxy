# Disqus-Proxy: Server

## TODO

- [ ] 后端
  - [x] Logger Refactory
  - [ ] 写一个 approve/spam 功能
  - [ ] 写一个 vote 功能
  - [ ] 整理一下 config 的详细
  - [ ] 整理一下 readme 里面的 config 的详细
  - [ ] Readme 最好全部整理一下
- [ ] 前端
  - [ ] 写一个管理页面
  - [ ] 添加一下 Vote 功能

## API

* 获取所有文章
  + GET `/api/getThreads` 
  + 参数: 
    - include: `string[]` 
      - 默认 `approved` , 可选选项: unapproved, approved, spam, deleted, flagged, highlighted
* 获取所有评论
  + GET `/api/listPosts` 
* 获取特定文章评论
  + GET `/api/getComments` 
  + 参数: 
    - identifier: `string` 
      - 文章 Indent, 一般就是对应的 Post 的 url
* 添加评论 
  + POST `/api/createComment` 
  + 参数:
    - author_email: `string` 
      - 邮箱名
    - author_name: `string` 
      - 用户名
    - message: `string` 
      - 正文内容
    - parent: `null | number` 
      - null 或者 parent 评论的 ID
    - thread: `number` 
      - 文章 ID, 注意这里不是 Ident, 只接受纯数字



## Dev

1. 安装依赖
    ``` 
      npm install
    ```
2. 配置 server 目录下的config.js
    ``` js
    module.exports = {
      // 服务端端口，需要与 disqus-proxy 前端设置一致
      port: 5509,
      // 你的 diqus secret key
      api_secret: 'your secret key',
      // 你的 disqus 名称，就是forum名称
      username: 'ciqu',
      // 服务端 socks5 代理转发，便于在本地测试，生产环境通常为 null
      socks5Proxy: null,
      // 日志输出位置, 输出到文件或控制台 'file' | 'console'
      log: 'console'
    }
    ```
    api secret key 需要在 [Disqus 的 API 页面](https://disqus.com/api/applications/)申请

    另外需要到 `Settings => Community` 里开启访客评论

3. 启动服务

    ``` 
    cd server
    npm start
    ```

    > 正常运行服务，关闭 ssh 的时候就会关闭服务器，因此可以考虑使用 forever 插件

5. 让服务跟随服务器自动启动  

## Debug

本地运行的条件是 **本地已经可以访问 Disqus**, 因此建议挂载到 VPS 进行 FTP 连接调试.

进入 `\server` 执行:

``` 
npm install
nodemon index.js
```

即可开启调试.

确认开启服务端之后到浏览器输入 `http://localhost:5050/api/listPosts` 应该会显示所有评论数据

