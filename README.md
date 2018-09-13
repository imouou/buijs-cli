# buijs 命令行工具


| **描述**            | **修改日期**    |
|:-------------------|-------------------:|
|新增update命令,修复update平台时,会覆盖index.html,index.js问题    |2018-2-1    |
|新增NPM开发模式,修改了目录规范,修复无网络无法创建问题    |2018-3-25    |
|新增buijs update -d 更新工程gulpfile.js package.json app.json    |2018-4-12    |
|修复buijs create 不能在同个工程下创建子工程    |2018-5-30    |
|新增对相同模板目录的检测,避免重复覆盖    |2018-8-01    |

## 一、简介

> [buijs](https://github.com/imouou/buijs-cli) 是[BUI Webapp交互框架](http://www.easybui.com) 的cli命令工具, 用于快速生成指定平台与模板最新的工程文件.

*通过命令行构建,有以下好处:*

1. 自动获取最新的BUI模板工程;
2. 可以指定bui对应的平台版本;
3. 可以指定bui的单页模板.  [BUI模板图片预览](https://github.com/imouou/BUI-Template/) ;
4. 拥有服务器并支持接口跨域调试;
5. 自动编译压缩混淆文件,便于打包部署的安全;
6. 支持ES6编译;
7. 支持sass编译;
8. 减少对工具的依赖


## 二、安装buijs命令行工具

> 需要先安装 [node环境](https://nodejs.org/zh-cn/) 才能使用npm命令. 如果下载缓慢,建议先安装[淘宝的npm镜像](https://npm.taobao.org/), 把以下命令的`npm`换成`cnpm`;

*windows:*
```bash
npm install -g buijs
```

*mac: 一般需要权限,需要加sudo,还要输入密码回车确认*
```bash
$ sudo npm install -g buijs
```

## 三、初始化工程目录:

![buijs 创建工程预览](http://www.easybui.com/docs/images/router/buijs-create-demo_low.gif)


### 3.1 创建默认Webapp工程 

```bash

# * 创建webapp工程 (demo 为工程名称, 如果没有,则在当前目录)
$ buijs create demo 

# * 进入工程目录
$ cd demo

# * 安装依赖
$ npm install 

# * 自动打开浏览器并监听js,scss,html等文件的修改
$ npm run dev


# 非必须命令,编译工程,生成dist目录,压缩脚本,样式,图片,用于发布打包的安全, 会清空之前目录,重新根据`src`目录生成.

$ npm run build

```
**注意:** `npm run dev`使用这个命令样式的修改都需要在 `src/scss/style.scss` 文件,可以分模块引入,如果直接修改`src/css/style.css`,需要删除`src/scss`目录,避免style.css被覆盖.


### 3.2 自动打开默认浏览器,  修改src 目录的相同文件,就会生成对应的dist文件,用于预览.  

`http://localhost:port` 

`port`端口自动生成, 一个端口对应一个工程, 如需更改同样是在`app.json` 配置.


### 3.3 工程模板预览

**默认模板预览**  更多模板点击这里 [BUI模板图片预览](https://github.com/imouou/BUI-Template/)

<img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/preview.png" alt="">


## 四、接口跨域及配置

### 接口跨域

打开根目录下的 `app.json` ,里面有个 `proxy` 的对象, key值为接口的目录名, `target` 为域名的host. 

假设请求的接口地址为: http://www.easybui.com/api/getDetail/id/123 

需要这样配置 proxy :

```js
{
...
"proxy": {
    "/api": {
      "target": "http://www.easybui.com",  
      "changeOrigin":true  
    }
  }
...
}
```

js: 脚本请求使用相对路径, 为了后面更改为正式地址, 建议可以把url部分作为配置项.

```js
var apiUrl = "";

bui.ajax({
    url: apiUrl+ "api/getDetail/id/123"
}).then(function(res){
    
})
```

### 服务器的配置说明

打开根目录下的 `app.json ,里面有个 devServer 的对象.
```js
{
  "distServer": {
    "root": "dist",                   // 编译的目录
    "livereload": true,               // 修改自动刷新
    "port": 2149                      // 端口号,默认第一次随机自动生成
  }
}

```

## 五、命令列表

注意: 中括号为可选,如果没有采用默认

### buijs 命令列表

| **命令行**   | **描述**           |
|:------------- |:-------------------|
| `buijs -v`       |查看当前工具的版本    |
| `buijs -h`       |命令帮助信息    |
| `buijs create `  |在当前目录创建bui webapp默认工程    |
| `buijs create [projectName] [version] [-t templateName] [-p platformName]`       |创建工程,支持指定版本,指定模板,指定平台,相同目录下会覆盖    |
| `buijs update` | 在当前项目更新 bui为最新webapp版本,只修改bui.css,bui.js不覆盖项目其它内容    |
| `buijs update [projectName] [version] [-p platformName] [-d]` | 更新bui为某个版本,某个平台, -d 更新为最新的工程模式(dev)    |
| `buijs list`       |显示可用的版本    |
| `buijs list-template`       |显示可用的模板列表 [BUI模板图片预览](https://github.com/imouou/BUI-Template/)    |
| `buijs list-platform`       |显示可用的平台列表    |

### NPM 命令列表

| **命令行**   | **描述**           |
|:------------- |:-------------------|
| `npm run build` | 编译成可以打包的文件,默认服务器根路径是"dist",所以需要先编译    |
| `npm run dev` | 启动服务并打开默认浏览器,支持接口跨域, 并且会自动监听脚本,scss文件,html文件的修改编译    |
| `npm run server` | 启动默认8000端口的服务,并且默认支持了接口跨域,需要在app.json配置对应的接口地址    |


## 六、命令示例
### 创建某个模板工程 ( main-tab 为模板名称)
可以先查看有什么模板 `buijs list-template`, [BUI模板图片预览](https://github.com/imouou/BUI-Template/)

```bash
# 查看有什么模板
$ buijs list-template

# 进入当前工程 demo
$ cd demo

# 替换main模板 
$ buijs create -t main-tab

# 新增login模板 
$ buijs create -t page-login

```

**效果预览**  
<img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/main-tab/preview.png" alt="">
> <strong style="color:red">注意:</strong>
1. 同一个工程可以多次创建模板;
模板名以 `main-`开头 会覆盖 main 模块, 例如: 模板名 `main-tab` 预览地址 `index.html`
模板名以 `page-`开头 会新增页面, 例如: 模板名 `page-login` 预览地址 `index.html#pages/login/login`;
2. `main-`开头的模板会覆盖main页面, `page-`开头的模板是新增页面;
3. 同一个工程只能创建一个平台, 多次创建会相互覆盖;


### 创建指定平台工程 ( dcloud 为平台名称 ) 

可以先查看有什么平台选择 `buijs list-platform`
> <strong style="color:red">注意:</strong>
1. 目前已经支持以下打包平台 cordova,bingotouch,dcloud,apicloud,appcan,微信 等; 
2. 不同平台对应的文件会有些许不同, 绑定原生后退的方法也不同, 不指定平台时, 默认是webapp平台, 可以在微信及webkit浏览器内核预览.

以下内容都是以进入 demo 工程示例.

```bash

# 创建Dcloud平台的应用
$ buijs create -p dcloud

```

### 创建dcloud平台下的某个模板工程

```bash

$ buijs create -t sidebar -p dcloud

```

### 创建指定版本工程
> 可以先查看有什么版本 `buijs list`

```bash
buijs create v1.0
```


### 更新工程为最新bui版本

```bash
buijs update
```


### 更新工程为最新bui版本及平台

```bash
buijs update -p bingotouch
```


### 更新工程为最新npm开发模式

```bash
buijs update -d
```


## 七、目录说明: 

**单页应用包文件夹说明:**

| **路径**   | **描述**           |
|:------------- |:-------------------|
| gulpfile.js     |入口文件    |
| package.json    |npm依赖配置文件    |
| app.json    |入口文件    |
| dist/     | 编译打包的目录    |
| src/index.html     |入口文件    |
| src/index.js       |入口的脚本    |
| src/css/bui.css  |BUI库的样式文件    |
| src/css/style.css  | 当前应用的样式文件    |
| src/font/         |字体图标目录    |
| src/images/       |应用图片目录    |
| src/scss/       | 样式源文件,样式最好放这里可以分模块管理    |
| src/js/zepto.js  | bui的依赖库  |
| src/js/plugins/fastclick.js  |  移动端快速点击的插件   |
| src/js/bui.js       |  BUI交互控件库   |
| src/pages/      | 模块目录    |
| src/pages/main       | 默认 main 模块    |
| src/pages/main/main.html      | 默认 main 模块模板    |
| src/pages/main/main.js      | 默认 main 模块定义脚本    |

## 八、手动引入

**不使用`buijs` cli命令行工具,你也依然可以使用bui,只需下载引入对应的脚本及样式库就行.**

```html
<!DOCTYPE HTML>
<html>
<head>
    <title>BUI开发工程页面</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <link href="//unpkg.com/buijs/lib/latest/bui.css" rel="stylesheet">
</head>
<body>
    <div class="bui-page">
        <header></header>
        <main>
            <!-- 正文内容 -->
        </main>
        <footer></footer>
    </div>

    <script src="//unpkg.com/buijs/lib/zepto.js"></script>
    <script src="//unpkg.com/buijs/lib/latest/bui.js"></script>
    <script>
      bui.ready(function(){
          // 控件初始化
      })
    </script>
</body>
</html>
```

<a href="http://jsbin.com/jukuvec/edit?html,js,output" target="_blank">在线体验BUI,自己动手DIY</a>