# buijs 命令行工具


| **描述**            | **修改日期**    |
|:-------------------|-------------------:|
|新增update命令,修复update平台时,会覆盖index.html,index.js问题    |2018-2-1    |
|新增NPM开发模式,修改了目录规范,修复无网络无法创建问题    |2018-3-25    |
|新增buijs update -d 更新工程gulpfile.js package.json app.json    |2018-4-12    |
|修复buijs create 不能在同个工程下创建子工程    |2018-5-30    |
|新增对相同模板目录的检测,避免重复覆盖    |2018-8-01    |
|修复输入版本号前必须输入工程名    |2018-10-31    |
|新增多工程共享 node_modules目录    |2018-12-07    |
|新增创建新模块命令 buijs create -m 模块名    |2019-01-22    |
|新增更改数据源命令, 默认是 github.  buijs create -f gitee     |2019-03-20    |
|完善创建新模块命令,需要结合最新的 buijs 及 bui-template 使用     |2019-08-26    |
|新增对工程的node不同版本的区分     |2020-04-01    |


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
8. 支持less编译;
9. 减少对工具的依赖


> ##重要更新
1.4.8 包含之前的版本是基于`540设计稿规范`, 新版1.5.0是基于`750设计稿规范`, 所以两个版本的使用方式及表现都是不同的, 旧工程不建议升级. 默认未指定版本, 都是基于1.5.0创建的750规范. 模板也是750. 如果旧项目想使用模板名, 需要先重新安装`buijs`, 在创建前加上 1.4.8 最新540规范版本.

旧项目使用指定版本模板示例:
```
$ buijs create 1.4.8 -t page-login
```

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


### 3.1 创建默认Webapp工程, 新版的buijs会针对不同的node版本,创建不同的工程,但是默认不会主动创建sass的编译支持.

```bash

# * 创建webapp工程 (demo 为工程名称, 如果没有,则在当前目录)
$ buijs create demo

# * 进入工程目录
$ cd demo

# * 安装依赖
$ npm install

# * 自动打开浏览器并监听js,scss,html等文件的修改
$ npm run dev


# 非必须命令,编译工程,生成dist目录,压缩脚本,样式,图片,用于发布打包的安全, 会清空之前目录,重新根据`src`目录生成. 另外, es6 的模块化 import ,Objece.assign 等方法不要使用, 会导致编译后在部分手机无法运行

$ npm run build

```

#### 3.1.1 如果需要工程对sass或者less支持

在刚刚创建的demo工程里面再次执行以下命令
```bash
$ buijs create -p sass
$ buijs create -p less
```

**注意:** `npm run dev`使用这个命令, 样式的修改都需要在 `src/scss/style.scss` 文件. 如果直接修改`src/css/style.css`,需要删除`src/scss`目录,避免style.css被覆盖.

> 安装时, 如果报 sass 错误, 请先执行 `npm remove node-sass` 然后再安装依赖.

> 如 github 下载缓慢, 可以使用新的命令 `buijs create -f gitee` 使用码云的下载源. buijs 需要更新到 0.6.6 以上才有.


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
| `buijs create [projectName] [version] [-t templateName] [-p platformName] [-m moduleName] [-f from]`       |创建工程,支持指定版本,指定模板,指定平台,相同目录下会覆盖    |
| `buijs update` | 在当前项目更新 bui为最新webapp版本,只修改bui.css,bui.js不覆盖项目其它内容    |
| `buijs update [projectName] [version] [-p platformName] [-d dev] [-f from]` | 更新bui为某个版本,某个平台, -d 更新为最新的工程模式(dev)    |
| `buijs list`       |显示可用的版本    |
| `buijs list-template`       |显示可用的模板列表 [BUI模板图片预览](https://github.com/imouou/BUI-Template/)    |
| `buijs list-platform`       |显示可用的平台列表    |
| `buijs clear`       |清除下载的模板缓存    |
| `buijs create -m 模块名 `  新     | 创建新的模块  m = module  |
| `buijs create -f 数据源 `  新     | 创建工程来自 gitee 或者 github , 默认是 github  f = from    |

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

# 新增一个新模块 apps 
$ buijs create -m apps

# 新增一个新子模块 apps/meeting 
$ buijs create -m apps/meeting

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

### 创建sass编译工程

```bash

$ buijs create -p sass

```

### 创建less编译工程

```bash

$ buijs create -p less

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

### 创建多页工程

```bash
buijs update -p pages
```


### 更新工程为最新npm开发模式 node10以上使用以下方式更新

```bash
buijs update -d
```
也可以指定更新对应的node版本
```bash
buijs update -d node8
buijs update -d node8-sass
buijs update -d node10
buijs update -d node10-sass
```

### 创建新模块

模块的访问路径: 默认: `index.html#pages/article/index`

```bash
buijs create -m article
```


## 七、目录说明:

**单页应用包文件夹说明:**

| **路径**   | **描述**           |
|:------------- |:-------------------|
| gulpfile.js     |入口文件    |
| package.json    |npm依赖配置文件    |
| app.json    |入口文件    |
| dist/     | 编译打包最终要部署的目录    |
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

## 八、多个bui工程共享`node_modules`模块目录

> 现在每次创建一个工程以后, 每次都需要执行 `npm install` 特别的繁琐, 通过以下步骤, 可以创建一个bui的相关工程共享 `node_modules`

1. 升级buijs 0.5.3
2. 创建bui工程目录, 作为所有工程目录 `buijs create bui-projects`, 删除 <del>src目录,app.json</del> ,只保留 `package.json, gulpfile.js `
3. `cd bui-projects` 进入目录
4. `npm install` 安装依赖模块
5. `buijs create project1` 创建带工程名的工程
6. `npm run dev-project1` 运行服务预览 或者 `npm run build-project1` 编译打包

```bash
# 创建 bui-projects 文件夹作为公共的bui应用目录
buijs create bui-projects

# 进入这个目录
cd bui-projects/

# 安装依赖
npm install

# 创建 project1 工程
buijs create project1

# 运行预览
npm run dev-project1

# 编译打包
npm run build-project1
```
> project1/gulpfile.js, project1/package.json 这两个文件则不需要了

## 九、更改数据源

> 国内部分地区创建工程时,个别反应,创建的过程过于缓慢. 现在我们新增一个命令用于指定数据源, 默认是在 `github`, 你可以通过 `-f` 命令,更改到 `gitee`

```bash
# 从 gitee 的最新版本创建默认工程. 
buijs create -f gitee

# 创建一次以后,在没有新版本的时候, 创建其它模板, 无需再加入这个 `-f` from命令. 
buijs create -t main-tab
```

## 十、创建完整案例参考

```bash

# 创建163案例
buijs create -t case-163
```
