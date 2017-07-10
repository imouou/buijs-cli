#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var config = {},    // 平台配置项
    platform = [],  // 平台名称
    PATH = ".";     // 当前路径

// 默认会执行webapp的创建
config.webapp = true;
platform.push("Webapp");

// ["-b","-d"]
process.argv.slice(2).forEach( function (item) {

  switch (item) {
    case "-b":
    // 原生方法更换为bingotouch开发平台
      config.bingotouch = true;
      removeArray("Webapp",platform);
      platform.push("Bingotouch");
      break;
    case "-l":
    // 原生方法更换为bingotouch开发平台
      config.link = true;
      removeArray("Webapp",platform);
      platform.push("Link");
      break;
    case "-a":
    // 原生方法更换为apicloud开发平台
      config.apicloud = true;
      removeArray("Webapp",platform);
      platform.push("Apicloud");
      break;
    case "-d":
    // 原生方法更换为dcloud开发平台
      config.dcloud = true;
      removeArray("Webapp",platform);
      platform.push("Dcloud");
      break;
    case "-w":
    // 原生方法更换为微信开发平台
      config.weixin = true;
      removeArray("Webapp",platform);
      platform.push("Weixin");
      break;
    case "-u":
    // 原生方法更换为微信开发平台
      config.update = true;
      break;
  }
});


// 更新
if( config.update ){
  mkdir(PATH + '/public', function () {

    // 复制样式
    buildCss();

    // 复制bui的不同版本的js更新
    buildJs();

  });

  console.info(platform.join("&")+" update complete.");

}else{
  // 复制包说明文件
  copyTemplate("package.json", PATH + '/package.json');

  mkdir(PATH + '/public', function () {

      // 复制web的首页
    copyTemplate("platform/web/template.html", PATH + '/public/template.html');

    // 复制样式
    buildCss();

    // 复制字体图标
    mkdir(PATH + '/public/font',function () {
      copyFile("font/iconfont.eot",PATH + '/public/font/iconfont.eot');
      copyFile("font/iconfont.svg",PATH + '/public/font/iconfont.svg');
      copyFile("font/iconfont.ttf",PATH + '/public/font/iconfont.ttf');
      copyFile("font/iconfont.woff",PATH + '/public/font/iconfont.woff');
    });

    // 创建images空目录,存放应用的图片
    mkdir(PATH + '/public/images');

    // 创建脚本文件
    mkdir(PATH + '/public/js',function () {

      // 复制web必备的js
      copyTemplate("platform/web/js/bui.js",PATH + '/public/js/bui.js');
      copyTemplate("js/zepto.js",PATH + '/public/js/zepto.js');

      // 复制公共的配置文件
      mkdir(PATH + '/public/js/app',function () {
          copyTemplate("js/app/_config.js",PATH + '/public/js/app/_config.js');
      })

      // 复制依赖的插件
      mkdir(PATH + '/public/js/plugins',function () {
          copyTemplate("js/plugins/fastclick.js",PATH + '/public/js/plugins/fastclick.js');
      })

      if ( config.bingotouch ){
      // 复制bingotouch的js
          copyTemplate("platform/bingotouch/js/cordova.js", PATH + '/public/js/cordova.js');
          copyTemplate("platform/bingotouch/js/bingotouch.js", PATH + '/public/js/bingotouch.js');
          copyTemplate("platform/bingotouch/js/bui.js", PATH + '/public/js/bui.js');
      }

      if ( config.link ){
      // 复制link的js
          copyTemplate("platform/link/js/cordova.js", PATH + '/public/js/cordova.js');
          copyTemplate("platform/link/js/bingotouch.js", PATH + '/public/js/bingotouch.js');
          copyTemplate("platform/link/js/linkplugins.js", PATH + '/public/js/linkplugins.js');
          copyTemplate("platform/link/js/bui.js", PATH + '/public/js/bui.js');
      }
      if( config.apicloud ){
          copyTemplate("platform/apicloud/js/bui.js",PATH + '/public/js/bui.js');
          copyTemplate("platform/apicloud/js/api.js",PATH + '/public/js/api.js');
      }
      if( config.dcloud ){
          copyTemplate("platform/dcloud/js/bui.js",PATH + '/public/js/bui.js');
      }

    })

    // 复制bingotouch的打包文件目录
    if( config.bingotouch ){
         // 替换首页
         copyTemplate("platform/bingotouch/template.html", PATH + '/public/template.html');

      // 复制res打包文件夹
        mkdir(PATH + '/public/res',function () {
          // 复制安卓的图标及启动页目录
          mkdir(PATH + '/public/res/android',function () {
              //
              mkdir(PATH + '/public/res/android/drawable-hdpi',function () {
                  copyFile("platform/bingotouch/res/android/drawable-hdpi/icon.png",PATH + '/public/res/android/drawable-hdpi/icon.png');
                  copyFile("platform/bingotouch/res/android/drawable-hdpi/splash.png",PATH + '/public/res/android/drawable-hdpi/splash.png');
              });
              //
              mkdir(PATH + '/public/res/android/drawable-ldpi',function () {
                  copyFile("platform/bingotouch/res/android/drawable-ldpi/icon.png",PATH + '/public/res/android/drawable-ldpi/icon.png');
                  copyFile("platform/bingotouch/res/android/drawable-ldpi/splash.png",PATH + '/public/res/android/drawable-ldpi/splash.png');
              });
              //
              mkdir(PATH + '/public/res/android/drawable-mdpi',function () {
                  copyFile("platform/bingotouch/res/android/drawable-mdpi/icon.png",PATH + '/public/res/android/drawable-mdpi/icon.png');
                  copyFile("platform/bingotouch/res/android/drawable-mdpi/splash.png",PATH + '/public/res/android/drawable-mdpi/splash.png');
              });
              //
              mkdir(PATH + '/public/res/android/drawable-xhdpi',function () {
                  copyFile("platform/bingotouch/res/android/drawable-xhdpi/icon.png",PATH + '/public/res/android/drawable-xhdpi/icon.png');
                  copyFile("platform/bingotouch/res/android/drawable-xhdpi/splash.png",PATH + '/public/res/android/drawable-xhdpi/splash.png');
              });
              //
              mkdir(PATH + '/public/res/android/drawable-xxhdpi',function () {
                  copyFile("platform/bingotouch/res/android/drawable-xxhdpi/icon.png",PATH + '/public/res/android/drawable-xxhdpi/icon.png');
                  copyFile("platform/bingotouch/res/android/drawable-xxhdpi/splash.png",PATH + '/public/res/android/drawable-xxhdpi/splash.png');
              });
          });
          
          // 复制ios的图标及启动页目录
          mkdir(PATH + '/public/res/ios',function () {
              // 复制ios的icons目录
              mkdir(PATH + '/public/res/ios/icons',function () {
                  copyFile("platform/bingotouch/res/ios/icons/icon-72.png",PATH + '/public/res/ios/icons/icon-72.png');
                  copyFile("platform/bingotouch/res/ios/icons/icon-72@2x.png",PATH + '/public/res/ios/icons/icon-72@2x.png');
                  copyFile("platform/bingotouch/res/ios/icons/icon.png",PATH + '/public/res/ios/icons/icon.png');
                  copyFile("platform/bingotouch/res/ios/icons/icon@2x.png",PATH + '/public/res/ios/icons/icon@2x.png');
                  copyFile("platform/bingotouch/res/ios/icons/icon512.png",PATH + '/public/res/ios/icons/icon512.png');
              });
              // 复制ios的启动页目录
              mkdir(PATH + '/public/res/ios/Template',function () {
                  mkdir(PATH + '/public/res/ios/Template/Images.xcassets',function () {
                      mkdir(PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage',function () {
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPad-Landscape-1024x768.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPad-Landscape-1024x768.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPad-Landscape-2048x1536.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPad-Landscape-2048x1536.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPad-Portrait-768x1024.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPad-Portrait-768x1024.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPad-Portrait-1536x2048.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPad-Portrait-1536x2048.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Landscape-2208x1242.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Landscape-2208x1242.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-320x480.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-320x480.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-640x960.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-640x960.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-640x1136.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-640x1136.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-750x1334.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-750x1334.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-1242x2208.png",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/iPhone-Portrait-1242x2208.png');
                          copyFile("platform/bingotouch/res/ios/Template/Images.xcassets/LaunchImage.launchimage/Contents.json",PATH + '/public/res/ios/Template/Images.xcassets/LaunchImage.launchimage/Contents.json');
                      });
                  });
              });
          });
        });
    }
    if ( config.link ){
    // 复制link的首页  
      copyTemplate("platform/link/template.html", PATH + '/public/template.html');
    }
    if ( config.weixin ){
    // 复制微信的首页 
      copyTemplate("platform/weixin/template.html", PATH + '/public/template.html');
    }
    if( config.apicloud ){
    // 复制apicloud的打包文件目录

        // apicloud 配置文件
        copyTemplate("platform/apicloud/config.xml",PATH + '/public/config.xml');
        // apicloud 首页引用
        copyTemplate("platform/apicloud/template.html",PATH + '/public/template.html');
        // 图标
        mkdir(PATH + '/public/icon',function () {
              copyFile("platform/apicloud/icon/icon150x150.png",PATH + '/public/icon/icon150x150.png');
        });
        // 启动页
        mkdir(PATH + '/public/launch',function () {
              copyFile("platform/apicloud/launch/launch1080x1920.png",PATH + '/public/launch/launch1080x1920.png');
        });
        
    }
    if( config.dcloud ){
    // 复制dcloud的打包文件目录

        // dcloud 配置文件
        copyTemplate("platform/dcloud/manifest.json",PATH + '/public/manifest.json');
        // dcloud 首页引用
        copyTemplate("platform/dcloud/template.html",PATH + '/public/template.html');

        mkdir(PATH + '/public/unpackage');
    }


  });

  // 创建应用的的源文件
  mkdir(PATH + '/src', function () {
    mkdir(PATH + '/src/scss',function () {
      copyTemplate("scss/__mixin.scss",PATH + '/src/scss/__mixin.scss');
      copyTemplate("scss/__variables.scss",PATH + '/src/scss/__variables.scss');
      copyTemplate("scss/_reset.scss",PATH + '/src/scss/_reset.scss');
      copyTemplate("scss/style.scss",PATH + '/src/scss/style.scss');
      // 考拉编译配置文件
      copyTemplate("scss/koala-config.json",PATH + '/src/scss/koala-config.json');
    })
  });

  console.info(platform.join("&")+" build complete.");
  console.info(" use \"npm run sass\" to watch the sass file changes.");
}

// 更新样式
function buildCss() {
  // 复制样式
    mkdir(PATH + '/public/css',function () {
      copyTemplate("css/bui.css",PATH + '/public/css/bui.css');
      copyTemplate("css/bui.css.map",PATH + '/public/css/bui.css.map');
      // 微信模板
      config.weixin && copyTemplate("platform/weixin/css/bui_weixin.css",PATH + '/public/css/bui_weixin.css');
    });
}

// 创建核心脚本更新
function buildJs() {
  // 创建脚本文件
    mkdir(PATH + '/public/js',function () {

      // 复制web必备的js
      config.webapp && copyTemplate("platform/web/js/bui.js",PATH + '/public/js/bui.js');
      
      // 更新 bingotouch
      config.bingotouch && copyTemplate("platform/bingotouch/js/bui.js", PATH + '/public/js/bui.js');
      config.bingotouch && copyTemplate("platform/bingotouch/js/cordova.js", PATH + '/public/js/cordova.js');
      config.bingotouch && copyTemplate("platform/bingotouch/js/bingotouch.js", PATH + '/public/js/bingotouch.js');
      
      // 更新 link
      config.link && copyTemplate("platform/link/js/bui.js", PATH + '/public/js/bui.js');
      config.link && copyTemplate("platform/link/js/cordova.js", PATH + '/public/js/cordova.js');
      config.link && copyTemplate("platform/link/js/linkplugins.js", PATH + '/public/js/linkplugins.js');
      config.link && copyTemplate("platform/link/js/bingotouch.js", PATH + '/public/js/bingotouch.js');

      // 更新 apicloud 
      config.apicloud && copyTemplate("platform/apicloud/js/bui.js", PATH + '/public/js/bui.js');
      config.apicloud && copyTemplate("platform/apicloud/js/api.js", PATH + '/public/js/api.js');

      // 更新 dcloud 
      config.dcloud && copyTemplate("platform/dcloud/js/bui.js", PATH + '/public/js/bui.js');

    })
}

// 复制模板
function copyTemplate (from, to) {
  from = path.join(__dirname, 'templates', from);
  write(to, fs.readFileSync(from, 'utf-8'))
}
// 复制图片
function copyFile (from, to) {
  from = path.join(__dirname, 'templates', from);
  write(to, fs.readFileSync(from))
}
// 写入文件
function write (path, str, mode) {
  fs.writeFileSync(path, str)
}

// 创建文件夹
function mkdir (path, fn) {
  fs.mkdir(path, function (err) {
    fn && fn()
  })
}

// 删除数组
function removeArray(name,arr,key) {  
    var data = arr || [];

    if( typeof(key) === "string"){
        for(var i in data){  
            try{  
                var arrs = data[i][key];

                if( arrs === name) {
                    data = data.splice(i,1); 
                } 
            }catch(e){}
        };
    }else{
        var index = arr.indexOf(name);

        return data = index > -1 ? data.splice(index,1) : arr;
    }
    
    return arr;
}; 
// 检测文件是否存在
function exists(filename,onSuccess,onFail) {
    fs.exists(__dirname + '/'+filename, function (isExist) {
      if( isExist ){
        onSuccess && onSuccess(isExist);
      }else{
        onFail && onFail(isExist);
      }
    });
}