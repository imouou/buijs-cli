# buijs 命令行工具

## 一、简介
buijs 是一个半自动工程化的命令工具, 只负责生成对应平台的必须的目录文件,并引用好依赖.

## 二、安装buijs命令行工具

windows: 
```
npm install -g buijs
```

mac: 
```
sudo npm install -g buijs
```

## 三、版本更新

### 1. 更新buijs包

windows: 
```
npm update -g buijs
```

mac: 
```
sudo npm update -g buijs
```

### 2. 更新工程里bui库的js及css

** 更新 webapp 版 示例:**
```
buijs -u 
```

** 更新 Bingotouch 版 示例:**
```
buijs -u -b
```

## 四、初始化工程目录:

webapp: webapp开发工程包
```
buijs
```

Bingotouch: Bingotouch打包工程目录,包含res文件夹
```
buijs -b
```

Link: Link开发工程包
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

## 五、编译说明:

1. 有node环境可以直接用`npm run sass` 直接监听style.scss 的文件生成, 但必须先安装了ruby && sass 的编译环境( <a href="https://www.sass.hk/install/" target="_blank">安装教程</a> ).

### 安装 sass

windows: 
```
gem install sass
```

mac: 
```
sudo gem install sass
```

2. 没有node环境,默认生成的目录包里面,有一份Koala的配置文件,可以<a href="http://koala-app.com/index-zh.html" target="_blank">下载Koala应用,拖拽scss文件夹到考拉应用里面,会自动生成.</a>


## 六、目录说明:

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

