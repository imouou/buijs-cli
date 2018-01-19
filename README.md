# buijs-cli 命令行工具

## 一、简介
buijs-cli 是[BUI交互框架](http://www.easybui.com) (专注webapp快速开发)的npm命令工具, 负责生成对应平台的必须的工程文件. 需要先安装 [node环境](https://nodejs.org/zh-cn/) 才能使用npm命令. 

通过命令行构建的工程,每次都会自动获取最新的BUI模板工程, 并且可以指定模板及平台. 更多模板请访问 [BUI模板](http://www.easybui.com/scenes/)

## 二、安装buijs命令行工具

windows: 
```
npm install -g buijs
```

mac: 
```
sudo npm install -g buijs
```

## 三、常见命令

| **命令行**   | **描述**           |
|:------------- |:-------------------|
| `buijs -v`       |查看当前工具的版本    |
| `buijs -h`       |命令帮助信息    |
| `buijs list`       |显示可用的版本    |
| `buijs list-template`       |显示可用的模板列表    |
| `buijs list-platform`       |显示可用的平台列表    |
| `buijs create <projectName> [version]`       |创建bui默认工程    |
| `buijs create <projectName> [version] -t tab`       |创建bui tab在底部的模板工程,默认平台 webapp    |
| `buijs create <projectName> [version] -t tab -p link`       |创建bui tab在底部的模板工程,更改平台为 link    |


## 四、初始化工程目录:

![buijs 创建工程预览](http://www.easybui.com/docs/images/router/buijs-create-demo_low.gif)


### 创建默认Webapp工程 (demo 为工程名称)

```bash
buijs create demo 
```

### 创建某个模板工程 ( tab 为模板名称)
> 可以先查看有什么模板 `buijs list-template`

```bash

buijs create demo -t tab

```

### 创建侧边栏模板工程

```bash

buijs create demo -t sidebar

```


### 创建指定平台工程 ( dcloud 为平台名称 ) 
> 可以先查看有什么平台 `buijs list-platform`

```bash
buijs create demo -p dcloud
```


### 创建某个平台下的某个模板工程

```bash
buijs create demo -t sidebar -p link
```

### 创建指定版本工程
> 可以先查看有什么版本 `buijs list`

```bash
buijs create demo v1.0
```

## 五、目录说明: 

** 单页应用包文件夹说明: **

| **路径**   | **描述**           |
|:------------- |:-------------------|
| index.html     |入口文件    |
| index.js       |入口的脚本    |
| css/bui.css  |BUI库的样式文件    |
| font/         |字体图标目录    |
| images/       |应用图片目录    |
| js/zepto.js  | bui的依赖库  |
| js/plugins/fastclick.js  |  移动端快速点击的插件   |
| js/bui.js       |  BUI交互控件库   |
| pages/      | 模块目录    |
| pages/main       | 默认 main 模块    |
| pages/main/main.html      | 默认 main 模块模板    |
| pages/main/main.js      | 默认 main 模块定义脚本    |
