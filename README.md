# buijs-cli

## 简介
BUI的不同平台开发包的命令行生成工具.

## 安装

windows: 
```
npm install -g buijs
```

mac: 
```
sudo npm install -g buijs
```

## 初始化工程目录:

webapp: 默认就是引入webapp开发工程目录
```
buijs
```

Bingotouch: 引入Bingotouch打包工程目录
```
buijs -b
```

Link: 引入link轻应用
```
buijs -l
```

Apicloud: 引入apicloud工程
```
buijs -a
```

Dcloud: 引入dcloud工程
```
buijs -d
```

微信: 引入微信样式
```
buijs -w
```

## 目录说明:

** 应用包文件夹说明: **

|- public
|- public / css / bui.css            // BUI库的样式文件
|- public / font /                   // 字体图标目录
|- public / images /                 // 应用图片目录
|- public / js  / zepto.js           // Zeptojs库
|- public / js  / bui.js             // BUI库的脚本文件
|- public / js  / app /              // 应用业务文件夹
|- public / js  / app / _config.js   // 应用公共配置脚本


** 工程源文件夹说明: **
|- src
|- src / sass  / __mixin.scss        // 应用公共方法配置
|- src / sass  / __variables.scss    // 应用公共变量配置
|- src / sass  / _reset.scss         // BUI 常用重置样式
|- src / sass  / style.scss          // 应用样式

