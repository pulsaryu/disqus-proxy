# Disqus-Proxy

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu) 

请共同参与抵抗 996 工作制, 祝所有 996 公司全部破产

## LICENSE

[![LICENSE](https://img.shields.io/badge/license-NPL%20(The%20996%20Prohibited%20License)-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

## 项目描述

Disqus 方向代理评论框的实现

>这个项目应该只有墙内的和平民众会使用, 所以我也不准备多语言的功能啦
>
>[ Demo 页面](http://szhshp.org/tech/2018/09/16/disqusrebuild2.html)


## 截图

- 评论框样式
   
   ![]( https://i.postimg.cc/mrqknRWX/Image_036.png  )
   
- 评论层级回复样式
   
   ![]( https://i.postimg.cc/4yRdJ5dp/Image_037.png  )

- 评论分页功能

   ![]( https://i.postimg.cc/9M705SWW/Image_038.png )


## 服务搭建

1. 首先你要有个 VPS, 并且 VPS 能够正常访问 Disqus
2. 到 [Disqus API 页面](https://disqus.com/api/applications/)注册一个新的 App, 记录其 `public key` 与 `secret key`
3. 耐心以及做一番折腾的心理准备

想要搭建一个代理评论框, 你需要进行两方面的 Deployment:

1. [   后端设置    ](server/README.md#server-deployment)
2. [前端设置](client/README.md#client-deployment)
