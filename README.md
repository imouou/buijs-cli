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

src里面是建议使用sass文件作为你的业务源码存储目录,提供出去只需要public目录就可以.

** 应用包文件夹说明: **

|- css / bui.css            // BUI库的样式文件
|- font /                   // 字体图标目录
|- images /                 // 应用图片目录
|- js  / zepto.js           // Zeptojs库
|- js  / bui.js             // BUI库的脚本文件
|- js  / app /              // 应用业务文件夹


