<h1 align="center">
Disqus-Proxy
</h1>

<div align="center"><img width="400px" src="logo.png"/></div>


<p align="center">
  
  
<img src="https://img.shields.io/badge/link-996.icu-red.svg"/>
<img src="https://img.shields.io/badge/license-NPL%20(The%20996%20Prohibited%20License)-blue.svg"/>
<img src="https://badges.frapsoft.com/os/gpl/gpl.svg?v=103"/>
</p>

## 项目描述

Disqus 代理评论框的实现

> 没有 VPS 也可以实现代理!!!!!
>
>这个项目应该只有墙内的和平民众会使用, 所以我也不准备多语言的功能啦
>
>[ Demo 页面](http://szhshp.org/tech/2017/08/20/jekylldisqusproxy.html)


## 服务搭建

下方任选一种即可 ↓↓↓↓↓↓↓

### Serverless 服务搭建 (推荐!)


参考这篇文章: [Disqus 评论框改造工程-实现 Disqus 代理的 Serverless 服务](https://szhshp.org/tech/2019/07/22/disquswithouvps.html)

### 标准服务搭建

>首先你要有个 VPS, 并且 VPS 能够正常访问 Disqus

首先到 [Disqus API 页面](https://disqus.com/api/applications/)注册一个新的 App, 记录其 `public key` 与 `secret key`

想要搭建一个代理评论框, 你需要进行两方面的 Deployment:

1. [   后端设置    ](server/#server-deployment)
2. [前端设置](client/#client-deployment)




## TODO

TODO:

- 点赞功能
- 设计一个代理后台来处理 Pending Comments

Finished:

- 跟踪版本更新功能
- 分页功能
- 撰写调试指导
- 判断是否可以载入 Disqus 原生评论框, 如果可以则直接载入, 否则加载**自定义评论框及评论列表**
      - 评论列表默认显示 50 条最近评论, 等我有时间来研究一下分页功能 
- 匿名评论功能
- 回复特定历史评论

## 截图

- 评论框样式
   
   ![]( https://i.postimg.cc/mrqknRWX/Image_036.png  )
   
- 评论层级回复样式
   
   ![]( https://i.postimg.cc/4yRdJ5dp/Image_037.png  )

- 评论分页功能

   ![]( https://i.postimg.cc/9M705SWW/Image_038.png )


