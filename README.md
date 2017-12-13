# buijs-cli 命令行工具

## 一、简介
buijs-cli 负责生成对应平台的必须的工程文件.

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
| `buijs list-template`       |显示可用的模板    |
| `buijs create <projectName> [version]`       |创建bui默认工程    |
| `buijs create <projectName> [version] -t link`       |创建bui示例工程，可以指定模版版本    |


## 四、初始化工程目录:

webapp: webapp开发工程包
```
buijs create demo
```

微信: 引入微信样式
```
buijs create demo -t weixin
```
Bingotouch: Bingotouch打包工程目录,包含res文件夹
```
buijs create demo -t bingotouch
```

Link: Link开发工程包
```
buijs create demo -t link

```

## 五、目录说明: 

** 单页应用包文件夹说明: **

| **路径**   | **描述**           |
|:------------- |:-------------------|
| index.html     |入口文件    |
| index.js       |入口的脚本    |
| css / bui.css  |BUI库的样式文件    |
| font /         |字体图标目录    |
| images /       |应用图片目录    |
| js  / zepto.js  | bui的依赖库  |
| js  / plugins/ fastclick.js  |  移动端快速点击的插件   |
| js  / bui.js       |  BUI交互控件库   |
| pages       | 模块目录    |
| pages / main       | 默认 main 模块    |
| pages / main / main.html      | 默认 main 模块模板    |
| pages / main / main.js      | 默认 main 模块定义脚本    |
