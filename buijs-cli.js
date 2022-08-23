#!/usr/bin/env node

const process = require("process");
const yargs = require("yargs");
const chalk = require('chalk');
const path = require("path");
const fs = require("fs-extra");
const decompress = require("decompress");
const jsonfile = require('jsonfile');
const request = require('request').defaults({
    headers: {
        'User-Agent': 'node request' // GitHub ask for this.
    }
});
const confirm = require('prompt-confirm');
const prompts = require('prompt');

const infoLabel = chalk.inverse.green("INFO");
const warningLabel = chalk.inverse("WARN");
const errorLabel = chalk.inverse("ERROR");

function log(msg) {
    console.log(`${infoLabel} ${msg}`);
}

function warn(msg) {
    console.log(chalk.yellow(`${warningLabel} ${msg}`));
}

function error(msg) {
    console.log(chalk.red(`${errorLabel} ${msg}`));
    process.exit(1);
}

// -----------------配置---------start
const templateDirName = "templates";
const platformDirName = "platforms";
// 1.6.x 的工程改为
const devDirName = "node";

// 默认缓存内容至 ~/CACHE_DIR
// /Users/xxx/.buijs/
const CACHE_DIR_NAME = ".buijs";
const CACHE_DIR_PATH = path.join(require('os').homedir(), CACHE_DIR_NAME);
const CACHE_TEMPLATE_PATH = path.join(CACHE_DIR_PATH, "template");
const TMP_DOWNLOAD_PATH = path.join(CACHE_TEMPLATE_PATH, "download.zip");
const RELEASES_JSON_PATH = path.join(CACHE_TEMPLATE_PATH, "release.json");
const Author_JSON_PATH = path.join(CACHE_TEMPLATE_PATH, "author.json");

// Github api
const GITHUB_REPO = "https://api.github.com/repos/imouou/BUI-Template/releases";
// Github下载: https://github.com/imouou/BUI-Template/archive/1.5.14.zip
// Gitee API 
const GITEE_REPO = "https://gitee.com/api/v5/repos/imouou/BUI-Template/releases";
// Gitee 下载, https://gitee.com/imouou/BUI-Template/repository/archive/1.5.14.zip
// easybui API 
const repoPath = 'https://www.easybui.com';
// 版本列表
const EASYBUI_REPO = repoPath + "/addons/cms/api.archives/index?page=1&channel=35";
// 版本详情
const releaseDetailUrl = repoPath + "/addons/cms/api.archives/detail?id=";
// Gitee 下载, https://www.easybui.com/downloads/source/bui/bui_router_dev_latest.zip
const releaseCountUrl = repoPath + "/addons/cms/archives/download.html"

var BUI_TEMPLATE_RELEASE_URL = EASYBUI_REPO;

// 登录地址
var LoginUrl = repoPath + '/addons/cms/api.login/login';

// -----------------配置---------end

// toggle repo 数据源切换
function toggleRepo(name) {

    switch (name) {
        case "github":
            BUI_TEMPLATE_RELEASE_URL = GITHUB_REPO;
            log("change repo github", BUI_TEMPLATE_RELEASE_URL)
            break;
        case "gitee":
            BUI_TEMPLATE_RELEASE_URL = GITEE_REPO;
            log("change repo gitee", BUI_TEMPLATE_RELEASE_URL)
            break;
        case "easybui":
        default:
            BUI_TEMPLATE_RELEASE_URL = EASYBUI_REPO;
            log("change repo easybui", BUI_TEMPLATE_RELEASE_URL)
            break;
    }
}

function getReleaseUrl(tag) {
    return BUI_TEMPLATE_RELEASE_URL + "/" + (tag ? `tags/${tag}` : "latest");
}

// log(RELEASES_JSON_PATH)
fs.ensureFileSync(RELEASES_JSON_PATH);

try {
    var releasesInfo = jsonfile.readFileSync(RELEASES_JSON_PATH);
} catch (e) {
    releasesInfo = {};
}


/**
 * 获取刚下载解压的 release 的路径
 * TODO: 目前无法准确获取 release 解压之后的目录名称，只能根据某种模式推断
 */
function getLastReleasePath() {
    let files = fs.readdirSync(CACHE_TEMPLATE_PATH);
    // 必须跟BUI模板的github的地址目录名一致.
    const pattern = "BUI-Template";
    for (let f of files) {
        if (f.indexOf(pattern) != -1) {
            return path.join(CACHE_TEMPLATE_PATH, f);
        }
    }
    error("Cannot find last release path.");
}

/**
 * 把 url (zipball_url) 的内容下载并解压到 savePath
 * @param {string} url
 * @param {string} savePath
 * @param {Function} cb
 */
function downloadAndUnzip(url, savePath, cb) {
    log("Trying to download...");
    let file = fs.createWriteStream(TMP_DOWNLOAD_PATH);
    file.on("close", function () {
        log("Extracting...");
        decompress(TMP_DOWNLOAD_PATH, CACHE_TEMPLATE_PATH).then(function () {
            log("Done extracting.");
            let origPath = getLastReleasePath();
            fs.moveSync(origPath, savePath); // 重命名为指定名
            fs.unlinkSync(TMP_DOWNLOAD_PATH); // 删除下载的压缩包
            if (cb) cb();
        })
    }).on("error", function (err) {
        console.log(err);
    });
    // log(url);
    request.get(url)
        .on("error", function (err) {
            error(`Error downloading release: ${err}`);
        })
        .on("response", function (res) {
            if (res.statusCode != 200) {
                error("Get zipUrl return a non-200 response.");
            }
        })
        .on("end", function () {
            log("Download finished.");
        })
        .pipe(file);
}

/**
 * 获取指定版本的 release，首先尝试缓存（CACHE_TEMPLATE_PATH），再尝试下载
 * @param {string} version 指定版本，如果为空，表示最新版本
 * @param {Function} cb 通过该回调返回 release 的路径，一般形如 ~/.bui-weex/template/0.1.0
 */
function fetchRelease(version, cb, needRequest) {
    needRequest = needRequest === false ? false : true;
    if (version) {
        // Version specified, try cache.
        let info = releasesInfo[version];
        if (info) {
            // Hit cache.
            log("Cache hit.")
            cb(path.join(CACHE_TEMPLATE_PATH, info.path));
            return;
        } else {
            log("Cache miss.");
        }
    }

    let url = getReleaseUrl(version);
    log(`Fetching release: ${version ? version : "latest"}...`);
    // last release 版本
    let lasRelease = function (argument) {
        // When fetch error, and no version specified, try to figure out the latest release.
        var latestRleaseInfo = null;
        for (let tag in releasesInfo) {
            let info = releasesInfo[tag];
            if (!latestRleaseInfo) {
                latestRleaseInfo = info;
            } else {
                if (Date.parse(info.time) > Date.parse(latestRleaseInfo.time)) latestRleaseInfo = info;
            }
        }

        return latestRleaseInfo;
    }


    if (!needRequest) {
        // When fetch error, and no version specified, try to figure out the latest release.
        let latestRleaseInfo = lasRelease();

        if (latestRleaseInfo) {
            // Figured out latest release in cache.
            log(`Found latest release in cache: ${latestRleaseInfo.tag}.`)
            cb(path.join(CACHE_TEMPLATE_PATH, latestRleaseInfo.path));
            return;
        } else {
            log(`需要先创建工程以后,才能创建模块.`)
        }
        return;
    }

    // log(url)
    request(url, function (err, res, body) {

        if (err) {
            // When fetch error, and no version specified, try to figure out the latest release.
            let latestRleaseInfo = lasRelease();

            if (latestRleaseInfo) {
                // Figured out latest release in cache.
                log(`Found latest release in cache: ${latestRleaseInfo.tag}.`)
                cb(path.join(CACHE_TEMPLATE_PATH, latestRleaseInfo.path));
                return;
            }
            error(err);
        }
        if (res.statusCode != 200) {
            warn(`Failed to fetch ${url} - ${res.statusCode}: ${res.body}`);
            if (!version) {
                // When fetch error, and no version specified, try to figure out the latest release.
                let latestRleaseInfo = lasRelease();

                if (latestRleaseInfo) {
                    // Figured out latest release in cache.
                    log(`Found latest release in cache: ${latestRleaseInfo.tag}.`)
                    cb(path.join(CACHE_TEMPLATE_PATH, latestRleaseInfo.path));
                    return;
                }
            }
            error(`Failed to fetch release of ${version ? version : "latest"}`);
        }
        // Successfully fetched info.
        let info = JSON.parse(body);
        let newInfo = {};
        let tag = newInfo.tag = info["tag_name"];
        newInfo.time = info["published_at"] || info["created_at"];
        newInfo.path = newInfo.tag;
        let targetPath = path.join(CACHE_TEMPLATE_PATH, newInfo.path);
        if (fs.pathExistsSync(targetPath)) {
            // Probably we are fetching latest release...
            log(`Already cached release.`);
            cb(targetPath);
            return;
        }
        // github: obj[zipball_url]
        // gitee: obj[assets][0][browser_download_url]
        let downloadUrl = info.hasOwnProperty("zipball_url") ? info["zipball_url"] : info["assets"] && info["assets"][0] && info["assets"][0]["browser_download_url"] || "";
        downloadAndUnzip(downloadUrl, targetPath, function () {
            releasesInfo[tag] = newInfo;
            jsonfile.writeFileSync(RELEASES_JSON_PATH, releasesInfo, { spaces: 2 });
            cb(targetPath);
            return;
        });
    })
}

/**
 * 获取指定版本的 release，首先尝试缓存（CACHE_TEMPLATE_PATH），再尝试下载
 * @param {string} version 指定版本，如果为空，表示最新版本
 * @param {Function} cb 通过该回调返回 release 的路径，一般形如 ~/.bui-weex/template/0.1.0
 */
function fetchEasybuiRelease(version, cb, needRequest) {
    needRequest = needRequest === false ? false : true;
    if (version) {
        // Version specified, try cache.
        let info = releasesInfo[version];
        if (info) {
            // Hit cache.
            log("Cache hit.")
            cb(path.join(CACHE_TEMPLATE_PATH, info.path));
            return;
        } else {
            log("Cache miss.");
        }
    }

    // last release 版本
    let lasRelease = function (argument) {
        // When fetch error, and no version specified, try to figure out the latest release.
        var latestRleaseInfo = null;
        for (let tag in releasesInfo) {
            let info = releasesInfo[tag];
            if (!latestRleaseInfo) {
                latestRleaseInfo = info;
            } else {
                if (Date.parse(info.time) > Date.parse(latestRleaseInfo.time)) latestRleaseInfo = info;
            }
        }

        return latestRleaseInfo;
    }
    log(`Fetching release: ${version ? version : "latest"}...`);

    if (!needRequest) {
        // When fetch error, and no version specified, try to figure out the latest release.
        let latestRleaseInfo = lasRelease();

        if (latestRleaseInfo) {
            // Figured out latest release in cache.
            log(`Found latest release in cache: ${latestRleaseInfo.tag}.`)
            cb(path.join(CACHE_TEMPLATE_PATH, latestRleaseInfo.path));
            return;
        } else {
            log(`需要先创建工程以后,才能创建模块.`)
        }
        return;
    }
    // 获取所有版本列表
    request(EASYBUI_REPO, function (err, res, body) {
        if (err) {
            // When fetch error, and no version specified, try to figure out the latest release.
            let latestRleaseInfo = lasRelease();

            if (latestRleaseInfo) {
                // Figured out latest release in cache.
                log(`Found latest release in cache: ${latestRleaseInfo.tag}.`)
                cb(path.join(CACHE_TEMPLATE_PATH, latestRleaseInfo.path));
                return;
            }
            error(err);
        }
        if (res.statusCode != 200) {
            warn(`Failed to fetch ${url} - ${res.statusCode}: ${res.body}`);
            if (!version) {
                // When fetch error, and no version specified, try to figure out the latest release.
                let latestRleaseInfo = lasRelease();

                if (latestRleaseInfo) {
                    // Figured out latest release in cache.
                    log(`Found latest release in cache: ${latestRleaseInfo.tag}.`)
                    cb(path.join(CACHE_TEMPLATE_PATH, latestRleaseInfo.path));
                    return;
                }
            }
            error(`Failed to fetch release of ${version ? version : "latest"}`);
        }
        // Successfully fetched info.
        let info = JSON.parse(body);
        // 最新的版本
        let releaseInfo = info.data.pageList.data[0];
        // info.data.pageList.data[]

        if (version) {
            for (let i in info.data.pageList.data) {
                let item = info.data.pageList.data[i];
                if (item.version == version) {
                    releaseInfo = item;
                    break;
                }
            }
        }

        let newInfo = {};
        let tag = newInfo.tag = releaseInfo["version"];
        newInfo.time = releaseInfo["publishtime"] || releaseInfo["createtime"];
        newInfo.path = newInfo.tag;
        newInfo.id = releaseInfo.id;
        let targetPath = path.join(CACHE_TEMPLATE_PATH, newInfo.path);
        if (fs.pathExistsSync(targetPath)) {
            // Probably we are fetching latest release...
            log(`Already cached release.`);
            cb(targetPath);

            // 增加统计
            addup({ id: releaseInfo.id })
            return;
        }

        let downloadUrls = JSON.parse(releaseInfo["downloadurl"]);
        let downloadUrl = "";
        for (let urlitem in downloadUrls) {
            let localUrl = downloadUrls[urlitem]["url"];
            if (localUrl) {
                downloadUrl = repoPath + localUrl;
                break;
            }
        }

        downloadAndUnzip(downloadUrl, targetPath, function () {
            releasesInfo[tag] = newInfo;
            jsonfile.writeFileSync(RELEASES_JSON_PATH, releasesInfo, { spaces: 2 });
            cb(targetPath);
            return;
        });

        // 统计
        addup({ id: releaseInfo.id });

    })

}

var fetchMethod = {
    fetchRelease: fetchRelease,
    fetchEasybuiRelease: fetchEasybuiRelease
}

// 增加下载次数
function addup(opt) {

    // 统计
    request.post({
        url: releaseCountUrl,
        form: opt
    }, function (err, httpResponse, body) {

    })
}
/**
 * 复制 template 文件以创建 bui 工程.
 * @param  {string} [name] project name.
 * @param  {string} [version] template version.
 * @param  {string} [templateName] init templates/ dir with specified template
 * @param  {string} [platformName] init platforms/ dir with specified template
 * @param  {string} [dev] init NPM Package.json
 */
function initProject(names, version, templateName, platformName, moduleName, repoName) {
    // 获得当前路径
    let name = '';
    // repoName = repoName || "gitee";
    // 判断工程文件是否需要使用新版的
    let nodeVersion = process.version.slice(1);
    let hightVersion = parseFloat(nodeVersion) > 10;

    let defaultNewModule = "page-newmodule"; // 默认新模块的名字
    if (names && names.includes('.')) {
        name = path.resolve('./');
        version = names;
    } else {
        name = names || path.resolve('./');
        version = version;
    }
    if (repoName) {
        toggleRepo(repoName);
    }

    let jsDir = path.join(name, "js");
    let pagesDir = path.join(name, "pages");
    // 通过判断当前目录下是否有
    let hasJsFolder = fs.existsSync(jsDir) || fs.existsSync(pagesDir);
    // 如果是开发模式,源码全在src目录,并且有 package.json
    let rootName = hasJsFolder ? name : name + '/src';

    // 检测是否存在当前模板
    let tplName = templateName && templateName.indexOf("-") ? (templateName.split("-")[1] || "") : "";
    let tplNameDir = path.join(rootName, "pages", tplName);
    let hasTplName = fs.existsSync(tplNameDir);
    // 项目是否已经存在的检测
    let isExistProject = false;
    // 先检测有没有相同模板
    if (hasTplName) {
        var prompt = new confirm('The Template already exists in the project. Press "Enter" to overwrite.');
        prompt.ask(function (answer) {
            if (!answer) {
                return;
            } else {
                // 如果用户有传项目名称,没有则在当前目录创建,检测是否存在js目录,用于检测
                checkProjectIsExist();

                return;
            }
        });
    } else {
        // 如果用户有传项目名称,没有则在当前目录创建,检测是否存在js目录,用于检测
        checkProjectIsExist();
    }

    // 检测工程目录是否存在, 警告用户会覆盖工程
    function checkProjectIsExist() {
        // 如果存在js目录,或者src目录,提示可能会覆盖
        // 如果创建子目录,并且子目录不存在,则认为项目不存在,不弹出提醒.
        if (hasJsFolder || fs.existsSync("src") || (names && fs.existsSync(names))) {

            isExistProject = true;

            createProject();

            return;
        }
        isExistProject = false;
        createProject();
    }

    // 创建工程
    function createProject() {
        log("Creating project...");

        // 创建模块名的时候无需请求
        let needRequest = moduleName ? false : true;
        // 获取bui版本，操作方式跟github不一样
        var fetchRepo = repoName && repoName !== 'easybui' ? fetchMethod["fetchRelease"] : fetchMethod["fetchEasybuiRelease"];

        fetchRepo(version, function (releasePath) {
            // 工程缓存路径 /demo/cache
            let cachePath = path.join(name, "cache");
            // 项目模板文件夹路径 /demo/src/templates
            let templateDir = path.join(rootName, templateDirName);
            // NPM 开发目录 /demo/src/dev 新版为 /demo/src/node
            let devDir = path.join(rootName, devDirName);
            // 项目平台文件夹路径 /demo/src/platforms
            let platformDir = path.join(rootName, platformDirName);

            log("Copying default template file...");
            // 复制文件到项目的cache目录
            fs.copySync(releasePath, cachePath);
            // 再从cache复制到根目录,防止多次创建覆盖
            // 如果没有加参数,创建默认工程不会覆盖之前的工程
            // 如果项目存在但是有名称,允许复制
            if (isExistProject && names != undefined) {
                fs.copySync(cachePath, rootName);
            }
            // 如果项目不存在才会复制
            if (!isExistProject) {
                fs.copySync(cachePath, rootName);

            }

            if (fs.existsSync("package.json") && names) {

                // 修改多工程的项目名
                modifyPackage(names);
            }

            // 复制模板或者平台或者新的模块
            if (templateName || platformName || moduleName) {

                // 缓存模板文件夹路径 /demo/cache/templates/
                let templateCacheDir = path.join(cachePath, templateDirName);
                // 模板平台文件夹路径 /demo/cache/platforms/
                let platformCacheDir = path.join(cachePath, platformDirName);

                // 删除根路径并复制模板
                if (templateName) {

                    // /demo/cache/templates/main-tab
                    let templateNameCache = path.join(templateCacheDir, templateName);
                    if (!fs.existsSync(templateNameCache)) {
                        // 删除缓存
                        fs.removeSync(cachePath);
                        error("template " + templateName + " is not exist");
                        // return;
                    }
                    log("Copying template file.");
                    initTemplate(templateNameCache);
                }
                if (moduleName) {
                    // /demo/cache/templates/page-newmodule
                    let templateNameCache = path.join(templateCacheDir, defaultNewModule);

                    if (!fs.existsSync(templateNameCache)) {
                        // 删除缓存
                        fs.removeSync(cachePath);
                        error("template " + templateName + " is not exist");
                        // return;
                    }
                    log("Copying template file.");
                    initTemplate(templateNameCache);
                    // 重命名新模块
                    moduleName && renameModule(moduleName);
                }
                // 复制平台需要的文件
                if (platformName) {
                    // /demo/cache/platforms/link
                    let platformNameCache = path.join(platformCacheDir, platformName);
                    if (!fs.existsSync(platformNameCache)) {

                        fs.removeSync(cachePath);
                        error("platform " + platformName + " is not exist");
                        // return;
                    }
                    log("Copying platform file.");
                    initPlatform(platformNameCache);
                }

            }
            if (!hasJsFolder && !fs.existsSync(path.join(name, "package.json"))) {
                let devCacheDir = hightVersion ? path.join(cachePath, devDirName + "/node10") : path.join(cachePath, devDirName + "/node8");
                // 初始化NPM模式
                initDev(devCacheDir);

            }
            // 最后删除模板文件夹
            fs.removeSync(templateDir);
            // 删除开发模式node文件夹
            fs.removeSync(devDir);
            // 删除旧版的dev文件夹
            fs.removeSync(path.join(rootName, "dev"));
            // 最后删除平台文件夹
            fs.removeSync(platformDir);
            // 删除缓存
            fs.removeSync(cachePath);

            log("Project created done.");


            // 写入package配置多工程名
            function modifyPackage(name) {
                log("modify package.json");
                // 获取根目录下的package.json
                var packageFile = path.join(path.resolve('./'), 'package.json');
                var package = require(packageFile);

                if ("projects" in package) {
                    // 设置json文件
                    package.projects[name] = name + '/app.json';
                    package.scripts[`dev-${name}`] = `cross-env NODE_ENV=${name} gulp dev`;
                    package.scripts[`build-${name}`] = `cross-env NODE_ENV=${name} gulp build`;
                    package.scripts[`package-${name}`] = `cross-env NODE_ENV=${name} gulp package`;
                    // 找到文件并同步修改
                    fs.writeFileSync(path.resolve(packageFile), JSON.stringify(package, null, 2));
                } else {
                    package.projects = {};
                    package.projects[name] = name + '/app.json';
                    package.scripts[`dev-${name}`] = `cross-env NODE_ENV=${name} gulp dev`;
                    package.scripts[`build-${name}`] = `cross-env NODE_ENV=${name} gulp build`;
                    package.scripts[`package-${name}`] = `cross-env NODE_ENV=${name} gulp package`;
                    // 找到文件并同步修改
                    fs.writeFileSync(path.resolve(packageFile), JSON.stringify(package, null, 2));
                }

            }
            // 初始化平台
            function initPlatform(platformDirName) {
                log("Initing platform...");
                // 平台路径 /cache/platforms/link
                if (!fs.existsSync(platformDirName)) {
                    warn(`Platform not exist. Using default platform webapp.`);
                    return
                }
                // 项目路径 /
                fs.copySync(platformDirName, rootName);
                // sass 平台对应不同的sass工程文件
                if (platformName === "sass") {
                    let devCacheDir = hightVersion ? path.join(cachePath, devDirName + "/node10-sass") : path.join(cachePath, devDirName + "/node8-sass");
                    // 初始化NPM模式
                    initDev(devCacheDir);
                }
                else if (platformName === "typescript") {
                    let devCacheDir = path.join(cachePath, devDirName + "/typescript");
                    // 初始化NPM模式
                    initDev(devCacheDir);
                }
                log("Copy platforms done.");
            }

            // 修改模块名字

            function renameModule(moduleName) {

                // 修改目录
                var pathModuleRoot = path.join(rootName, `pages/${defaultNewModule}`)
                var pathNewModuleRoot = path.join(rootName, `pages/${moduleName}`)
                // 修改目录
                fs.rename(pathModuleRoot, pathNewModuleRoot, function (err) {
                    if (err) {
                        warn(`存在相同的模块目录:${moduleName},请更换个名字重试!`);
                        fs.removeSync(pathModuleRoot);

                        return;
                        // throw err;
                    }
                    log(`create ${moduleName} Module done!`);
                })

            }
            // 初始化模板
            function initTemplate(templateDirName) {
                log("Initing template...");
                // 模板路径 /cache/templates/main-tab
                if (!fs.existsSync(templateDirName)) {
                    warn(`Template not exist. Using default Template.`);
                    return;
                }
                // 项目路径 /
                fs.copySync(templateDirName, rootName);
                log("Copy template done.");
            }
            // 初始化开发模式到根路径
            function initDev(devsDirName) {
                // 项目路径 /
                fs.copySync(devsDirName, name);
                log("Copy Dev done.");
            }
        }, needRequest);

    }


}

// 清除掉下载的缓存
function clearCache() {
    let hasCache = fs.existsSync(CACHE_TEMPLATE_PATH);

    if (hasCache) {
        // 最后删除模板文件夹
        fs.removeSync(CACHE_TEMPLATE_PATH);
    }
}

/**
 * 升级项目的bui版本,不覆盖index.html,index.js两个文件.
 * @param  {string} [name] project name.
 * @param  {string} [version] bui version.
 * @param  {string} [platformName] init platforms/ dir with specified template
 * @param  {string} [dev] 更新gulpfile.js package.js app.json
 */
function updateProject(names, version, platformName, devName, repoName) {
    var name = '';
    repoName = repoName || 'easybui';
    if (names && names.includes('.')) {
        name = path.resolve('./');
        version = names;
    } else {
        name = names || path.resolve('./');
        version = version;
    }

    if (repoName) {
        toggleRepo(repoName);
    }

    // 通过判断当前目录下是否有
    let hasJsFolder = fs.existsSync(path.join(name, "js")) || fs.existsSync(path.join(name, "pages"));
    // 如果是开发模式,源码全在src目录,并且有 package.json
    let rootName = hasJsFolder ? name : name + '/src';

    // 如果用户有传项目名称,没有则在当前目录创建,检测是否存在js目录,用于检测
    checkProjectIsExist();

    // 检测工程目录是否存在, 警告用户会覆盖工程
    function checkProjectIsExist() {
        // 如果存在js目录
        if (hasJsFolder || fs.existsSync("src")) {
            warn(`Project already exist.`);
            var prompt = new confirm('Do you Want to overwrite the project  ?');
            prompt.ask(function (answer) {
                if (!answer) {
                    // error(`File already exist.`);
                    return;
                } else {
                    log("Overwrite project...");
                    createProject();
                }
            });
            return;
        }
        log("Updateing project...");
        createProject();
    }
    // 创建工程
    function createProject() {
        // 获取bui版本，操作方式跟github不一样
        var fetchRepo = repoName && repoName == 'easybui' ? fetchMethod["fetchEasybuiRelease"] : fetchMethod["fetchRelease"];

        fetchRepo(version, function (releasePath) {
            // 工程缓存路径 /demo/cache
            let cachePath = path.join(name, "cache");

            // 开发包
            let devCachePath = path.join(cachePath, "dev");
            let packageFile = path.join(name, "package.json");
            // 平台
            let buiCssCachePath = path.join(cachePath, "css");
            let buiCssFileCachePath = path.join(buiCssCachePath, "bui.css");
            let buiJsCachePath = path.join(cachePath, "js");
            let buiJsFileCachePath = path.join(buiJsCachePath, "bui.js");
            // 项目目录
            let buiCssPath = path.join(rootName, "css");
            let buiCssFilePath = path.join(buiCssPath, "bui.css");
            let buiJsPath = path.join(rootName, "js");
            let buiJsFilePath = path.join(buiJsPath, "bui.js");

            // 项目平台文件夹路径 /demo/platforms
            let platformDir = path.join(rootName, platformDirName);

            log("copy cache file...");
            try {
                // 复制文件到项目的cache目录
                fs.copySync(releasePath, cachePath);
                // 再从cache复制bui.css文件到根目录,样式是通用的
                fs.copySync(buiCssFileCachePath, buiCssFilePath);
            } catch (e) {
                warn(`copy bui.css file error`);
            }

            if (platformName) {

                // 模板平台文件夹路径 /demo/cache/platforms/
                let platformCacheDir = path.join(cachePath, platformDirName);


                // 复制平台需要的文件
                // /demo/cache/platforms/link
                let platformNameCache = path.join(platformCacheDir, platformName);
                initPlatform(platformNameCache);
            } else {
                try {
                    // 再从cache复制bui.js webapp版文件到根目录
                    fs.copySync(buiJsFileCachePath, buiJsFilePath);
                } catch (e) {
                    warn(`copy bui.js file error`);
                }

            }

            // 更新npm 的包
            if (devName) {
                // 默认: 模板平台文件夹路径 /demo/cache/node/  如果有名称则是创建 /demo/cache/node/node10 之类的文件名
                let devCacheDir = devName === true ? path.join(cachePath, devDirName + "/node10") : path.join(cachePath, devDirName + "/" + devName);
                // 初始化NPM模式
                initDev(devCacheDir);

            }

            // 删除缓存
            fs.removeSync(cachePath);


            // 过滤掉 index.html, index.js 文件
            function filterFunc(src, dest) {
                // cache/index.html , cache/index.js
                let indexHtml = path.join(src, "index.html");
                let indexJs = path.join(src, "index.js");

                try {
                    // // 删除index.html,index.js文件以后再复制,防止覆盖用户原本的业务
                    fs.existsSync(indexHtml) && fs.unlink(indexHtml);
                    fs.existsSync(indexJs) && fs.unlink(indexJs);
                } catch (e) {
                    console.log(e);
                }
                return true;
            }
            // 初始化平台
            function initPlatform(platformDirName) {

                // 平台路径 /cache/platforms/link
                if (!fs.existsSync(platformDirName)) {
                    warn(`Platform not exist.`);
                    return
                }
                log("Update platform...");
                let buijs = path.join(platformDirName, "js");
                let buijsSrc = path.join(rootName, "js");
                // 更新平台下的js目录
                // fs.copySync(platformDirName, rootName, { filter: filterFunc });
                fs.copySync(buijs, buijsSrc);
                log("Platform update done.");
            }
            // 初始化dev
            function initDev(devsDirName) {
                log("Overwrite npm command...");
                // // 平台路径 /cache/dev
                fs.copySync(devsDirName, name);
                log("npm command update done.");
            }
        });
    }


}


// 清空某个文件夹目录
function emptyDir(fileUrl) {

    var files = fs.readdirSync(fileUrl); //读取该文件夹

    for (let i = 0; i < files.length; i++) {
        var file = files[i];
        var stats = fs.statSync(fileUrl + '/' + file);
        if (stats.isDirectory()) {
            // templates 目录不删
            // 清空文件,不包含文件夹
            // file !== templateDirName && emptyDir(fileUrl+'/'+file);
            // 清空文件夹,包含文件夹
            file !== templateDirName && fs.removeSync(fileUrl + '/' + file);;
        } else {
            file !== "README.md" && fs.unlinkSync(fileUrl + '/' + file);
            // log("删除文件"+fileUrl+'/'+file+"成功");
        }
    }
}

// 获取版本列表
function displayReleases(from) {
    log("Fetching version info...");
    from = from || "easybui";
    toggleRepo(from);
    request.get(BUI_TEMPLATE_RELEASE_URL, function (err, res, body) {
        if (err) error(err);
        if (res.statusCode != 200) error(`Failed to fetch releases info - ${res.statusCode}: ${res.body}`);
        let alltags = JSON.parse(body);
        let whichTags = from == "easybui" ? alltags.data.pageList.data : alltags;
        let tags = whichTags.map(function (e) { return from == "easybui" ? e["version"] : e["tag_name"] });
        console.log("Available versions:")
        tags.forEach(t => {
            console.log(chalk.green.underline(t));
        })
    });
}

// 获取模板列表
function getAvailableTemplateNames(projectPath, tplName) {
    let result = [];
    let tDir = path.join(projectPath, tplName);
    if (!fs.existsSync(tDir)) return result;
    let files = fs.readdirSync(tDir);
    for (let f of files) {
        if (fs.statSync(path.join(tDir, f)).isDirectory()) {
            result.push(f);
        }
    }
    return result;
}


// 登录
function login(name) {
    log("login easybui.com");

    var schema = {
    };
    if (!name) {
        schema = {
            properties: {
                name: {
                    // pattern: /^[a-zA-Z\s\-]+$/,
                    // message: 'Name must be only letters, spaces, or dashes',
                    required: true
                },
                password: {
                    hidden: true,
                    required: true
                }
            }
        };
        log("请输入账号密码");
    } else {
        schema = {
            properties: {
                password: {
                    hidden: true,
                    required: true
                }
            }
        };
        log("请输入密码");
    }


    prompts.get(schema, function (err, result) {
        if (err) error(err);
        //
        request.post({
            url: LoginUrl,
            form: {
                account: name || result.name,
                password: result.password
            }
        }, function (err, res, body) {
            if (err) error(err);

            // 保存用户信息
            jsonfile.writeFileSync(Author_JSON_PATH, body, { spaces: 2 });

            log("登录成功")

        });
    });

}

// 注销
function logout(name) {
    log("您确定要注销登录吗？");

    var prompt = new confirm('Are you sure you want to log out?');
    prompt.ask(function (answer) {
        if (!answer) {
            return;
        } else {
            try {
                fs.removeSync(Author_JSON_PATH);
            } catch (e) {
            }
        }
    });

}
// 检测是否登录过
function checkLogin() {
    var authorInfo = { data: { token: "" } };
    if (fs.existsSync(Author_JSON_PATH)) {
        // 必须使用jsonfile写入跟读取才能转化成对象
        authorInfo = jsonfile.readFileSync(Author_JSON_PATH);
        try {
            authorInfo = JSON.parse(authorInfo);
        } catch (e) { }
    }

    return !!authorInfo.data.token;
}

var args = yargs
    .command({
        command: "create [name] [version]",
        desc: "创建BUI的脚手架工程. 参数: name:工程名, version: bui版本. Create scaffolding project for BUI. Parameters: name: project name, version: bui version.",
        builder: (yargs) => {
            yargs.option('template', {
                alias: 't',
                describe: '使用某个模板构建. build using a template.'
            }).option('platform', {
                alias: 'p',
                describe: '使用某个平台工程构建. Build with a platform project.'
            }).option('module', {
                alias: 'm',
                describe: '创建新模块. Create new module'
            }).option('from', {
                alias: 'f',
                describe: '从哪个源创建，默认 easybui | github. Which source to create from, default easybui | github'
            })
        },
        handler: function (argv) {
            var isLogin = checkLogin();

            // 第一步验证是否登录过，第二步验证token过期
            if (isLogin) {

                initProject(argv.name, argv.version, argv.template, argv.platform, argv.module, argv.from);

            } else {
                error("先执行 buijs login 进行登录, 如果没有账号，请从 https://www.easybui.com 免费注册.")
            }
        }
    })
    .command({
        command: "update [name] [version]",
        desc: "更新工程里bui的版本, 不传参数时，默认为最新版本. Update the version of bui in the project. When no parameter is passed, the default is the latest version.",
        builder: (yargs) => {
            yargs.option('platform', {
                alias: 'p',
                describe: 'Update with specified platform.'
            }).option('dev', {
                alias: 'd',
                describe: 'Update npm command.'
            }).option('from', {
                alias: 'f',
                describe: 'from repo.'
            })
        },
        handler: function (argv) {
            var isLogin = checkLogin();

            // 第一步验证是否登录过，第二步验证token过期
            if (isLogin) {
                updateProject(argv.name, argv.version, argv.platform, argv.dev, argv.from);
            } else {
                error("先执行 buijs login 进行登录, 如果没有账号，请从 https://www.easybui.com 免费注册.")
            }
        }
    })
    .command({
        command: "get [id] [rename]",
        desc: "获取远程组件跟模板",
        builder: (yargs) => {
            yargs.option('save', {
                alias: 's',
                describe: '保存本地路径 默认 pages/.'
            })
        },
        handler: function (argv) {
            var isLogin = checkLogin();

            // 第一步验证是否登录过，第二步验证token过期
            if (isLogin) {
                getComponent(argv);
            } else {
                error("先执行 buijs login 进行登录, 如果没有账号，请从 https://www.easybui.com 免费注册.")
            }
        }
    })
    .command({
        command: "login [name] [password]",
        desc: "登录网站，如果没有账号密码，可以从 easybui.com 免费注册。If you don't know the account password, you can register for free from easybui.com ",
        handler: function (argv) {
            login(argv.name, argv.password);
        }
    })
    .command({
        command: "logout",
        desc: "注销登录 ",
        handler: function (argv) {
            logout();
        }
    })
    .command({
        command: "list",
        desc: "列出所有能创建的版本标签. List all version tags that can be created.",
        builder: (yargs) => {
            yargs.option('from', {
                alias: 'f',
                describe: 'from repo.'
            })
        },
        handler: function (argv) {
            displayReleases(argv.from);
        }
    })
    .command({
        command: "list-template",
        desc: "列出所有模板名字，结合-t参数使用. List all template names, use with -t parameter",
        handler: function () {

            fetchEasybuiRelease(null, (projectPath) => {
                let names = getAvailableTemplateNames(projectPath, templateDirName);
                if (names.length) {
                    console.log("Available templates:");
                    names.forEach(n => {
                        console.log(chalk.green.underline(n));
                    })
                } else {
                    console.log("No templates available.");
                }
            })
        }
    })
    .command({
        command: "list-platform",
        desc: "列出所有平台名字，结合-p参数使用. List all platform names, used in conjunction with the -p parameter",
        handler: function () {
            fetchEasybuiRelease(null, (projectPath) => {
                let names = getAvailableTemplateNames(projectPath, platformDirName);
                if (names.length) {
                    console.log("Available platforms:");
                    names.forEach(n => {
                        console.log(chalk.green.underline(n));
                    })
                } else {
                    console.log("No platforms available.");
                }
            })
        }
    })
    .command({
        command: "opendoc [name]",
        desc: "buijs opendoc 打开入门文档，buijs opendoc api 打开api文档",
        handler: function (argv) {
            var open = require('open');

            if (argv.name == "api") {
                // 使用默认浏览器打开
                open('https://www.easybui.com/p/api.html');
            } else {
                // 使用默认浏览器打开
                open('https://www.easybui.com/p/doc.html');
            }
        }
    })
    .command({
        command: "openchrome",
        desc: "打开谷歌浏览器. open a chrome",
        handler: function (argv) {
            var open = require('open');
            // var temppath = "";
            // switch(process.platform){
            //     case "win32":
            //         temppath = "C:\ChromeDevUserData";
            //     break;
            //     default:
            //         temppath = "/tmp/chrome_dev_test";
            //         break;
            // }
            // 打开一个可以跨域的chrome，新版mac无法读写，容易造成收藏夹数据丢失，不默认使用
            // open.openApp(open.apps.chrome, {arguments: ['--user-data-dir="'+temppath+'"','--disable-web-security','--allow-file-access-from-files']});
            // 打开可以请求本地文件的chrome
            open.openApp(open.apps.chrome, { arguments: ['--disable-web-security', '--allow-file-access-from-files'] });
        }
    })
    .command({
        command: "clear",
        desc: "清除构建缓存. clear cache.",
        handler: function () {
            clearCache();
        }
    })
    .version() // Use package.json's version
    .help()
    .alias({
        "h": "help",
        "v": "version",
        "p": "platform",
        "t": "template"
    })
    .strict(true)
    .demandCommand()
    .argv;