# Disqus-Proxy: Client

## Client Deployment

将 `/build/static` 文件夹 copy 到你的博客里面, 可以将所有的内容会在 index.html 加载, 然后配置下方一些字段:

```js
      window.disqusProxy = {
        username: 'szhshp',  // 你的 Disqus username
        server: 'xxx.xx.xxx.xx', // 部署了的 server 的 IP 或者直接 host name
        protocol: 'http', 
        port: 5050, // 如果没有 port 就直接删掉这一行, 或者设为 undefined
        defaultAvatar: '/img/default-avatar.png', // 默认头像
        adminAvatar: 'http://comic.szhshp.org/comic/10101/headshot/0 (2).png', // 管理员头像
        identifier: window.location.href, // 页面 identifier, 一般就是页面 url
        debug: 0 // debug 模式, 开启后可以跳过原生 disqus 的检测直接载入代理版本
      };
      window.disqus_config = function () {
        this.page.url = window.location.href;
        this.page.identifier = window.location.href;
      };
      var s = document.createElement('script');
      s.src = '/static/js/main.09c31d67.js'; //引用 static 文件夹下面的 JS, 这里可能需要修改一下文件名, 因为每一次 build 有不同的 hash
      s.async = true;
      document.body.appendChild(s);
```

另外, 对于原生 Disqus 的 fallback, 也需要配置一下, 在 index.html 里面设置一下即可

```js
  window.disqus_config = function () {
    this.page.url = identifier;
    this.page.identifier = identifier;
  };
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

