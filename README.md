# juejin-post2md

### 一键下载指定掘金用户的文章，并转换成md文件

#### 使用方法

``` sh
// 全局安装 juejin-post2md
// 使用 npm 安装
npm install -g juejin-post2md

// 使用 yarn 安装
yarn add -g juejin-post2md

// 项目中安装 juejin-post2md
// 使用 npm 安装
npm install -D juejin-post2md

// 使用 yarn 安装
yarn add -D juejin-post2md

// package.json 配置scripts
"scripts": {
  "jj-post2md": "jj-post2md"
}
```
#### 使用流程

``` sh
jj-post2md

? 请输入要下载的掘金用户ID号 <输入用户ID>
? 是否确定备份掘金用户 <用户juejin昵称> 的文章？ 
...
...
...
<开始下载>
```

#### 获取用户ID

获取用户id，如图：
点击用户头像/用户名，找到地址栏，如https://juejin.cn/user/2629687546222509

2629687546222509 则为用户ID

![用户ID](./readme.png)

