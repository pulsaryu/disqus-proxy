# Disqus-Proxy

>
>这个项目应该只有墙内的和平民众会使用, 所以我也不准备多语言的功能啦
>
>[ 使用参考以及测试页面](http://szhshp.org/tech/2018/09/16/disqusrebuild2.html)
>


## 样式截图

------
- 评论框样式
   
   ![]( https://i.postimg.cc/mrqknRWX/Image_036.png  )
   
- 评论层级回复样式
   
   ![]( https://i.postimg.cc/4yRdJ5dp/Image_037.png  )

- 评论分页功能

   ![]( https://i.postimg.cc/9M705SWW/Image_038.png )

------


## 使用方法

[repo链接](https://github.com/szhielelp/disqus-proxy)

>首先你要有个 VPS, 并且 VPS 能够正常访问 Disqus

### 前端配置

首先将 `client/static` 文件夹 copy 到你的博客里面, 然后前端引用这些文件并且进行配置

```html
    <!-- 必须提供一个 id 完全相同的 div -->
    <div id="disqus_thread"></div>

    <!-- 一些元素用到了 FA 的 icon, 这一段可以放到 header 里面 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


    <script>
      window.disqusProxy = {
        username:'szhshp',  // 你的 Disqus username
        server: 'xxx.xx.xxx.xx', // 你的 VPS IP
        port: 5000, // 这个 repo 的服务端对应的端口
        identifier: window.location.href // 页面 identifier, 一般就是页面 url
      };
      window.disqus_config = function () {
        this.page.url = window.location.href;
        this.page.identifier = window.location.href;
      };
      var s = document.createElement('script');
      s.src = '/static/js/main.09c31d67.js'; //引用 static 文件夹下面的 JS
      s.async = true;
      document.body.appendChild(s);
    </script>
    <!-- 引用 static 文件夹下面的 CSS -->
    <link rel="stylesheet" href="/static/css/main.331fc925.css"> 
```

### 后端配置

2. 安装依赖
    
            npm i --production
            // 或者
            yarn install --production
    
3. 配置 server 目录下的config.js
    
    <pre class="brush: js">
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
    </pre>

    api secret key需要在Disqus的API页面申请

    另外需要到`Settings => Community` 里开启访客评论

4. 启动服务

            cd server
            node index.js

    正常运行服务，关闭ssh的时候就会关闭服务器，因此可以考虑使用forever插件

5. 让服务跟随服务器自动启动  



#### Forever 的使用

安装见官方Repo: [    https://github.com/foreverjs/forever   ](https://github.com/foreverjs/forever)


很简单，只需要学会启动和关闭两个命令即可。

```
forever start app.js
forever stopall
```

#### 服务器自动启动

参考另一篇文章:  [优雅地乱玩Linux-7-Cron实现程序自启动](/tech/2017/08/26/croninlinux.html)


## 调试指导

### 服务端调试

本地运行的条件是本地已经可以访问 Disqus, 因此建议挂载到 VPS 进行 FTP 连接.

进入 `\server` 执行 `node index.js` 即可开启服务

### 客户端调试

进入 `\client` 执行 `npm start` 即可开启本地调试

#### 客户端构建

```
npm run-script build
```

