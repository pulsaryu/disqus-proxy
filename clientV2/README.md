# Disqus-Proxy: Client

## Client Deployment

首先将 `client/build/static` 文件夹 copy 到你的博客里面, 然后前端引用这些文件, 并且进行配置

```html
    <!-- 必须提供一个 id 完全相同的 div -->
    <div id="disqus_thread"></div>

    <!-- 一些元素用到了 FA 的 icon, 这一段可以放到 header 里面 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


    <script>
      window.disqusProxy = {
        username: 'szhshp',  // 你的 Disqus username
        server: 'xxx.xx.xxx.xx', // 部署了的 server 的 IP 或者直接 host name
        protocol: 'http', 
        port: 5050, // 如果没有 port 就直接删掉这一行, 或者设为 undefined
        defaultAvatar: '/img/default-avatar.png', // 默认头像
        adminAvatar: 'http://comic.szhshp.org/comic/10101/headshot/0 (2).png', // 管理员头像
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


## Debug

```
npm install

npm start
```

#### Build

```
npm build
```

