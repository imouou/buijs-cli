#!/usr/bin/env node

var yargs = require("yargs");
var chalk = require('chalk');
var path = require("path");
var fs = require("fs-extra");
var decompress = require("decompress");
var jsonfile = require('jsonfile');
var request = require('request').defaults({
    headers: {
        'User-Agent': 'node request' // GitHub ask for this.
    }
});

const templateDirName = "templates"

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

// 默认缓存内容至 ~/CACHE_DIR
const CACHE_DIR_NAME = ".buijs";
const CACHE_DIR_PATH = path.join(require('os').homedir(), CACHE_DIR_NAME);
const CACHE_TEMPLATE_PATH = path.join(CACHE_DIR_PATH, "template");
const TMP_DOWNLOAD_PATH = path.join(CACHE_TEMPLATE_PATH, "download.zip");
const RELEASES_JSON_PATH = path.join(CACHE_TEMPLATE_PATH, "release.json");


const BUI_TEMPLATE_RELEASE_URL = "https://api.github.com/repos/imouou/BUI-Template/releases";

function getReleaseUrl(tag) {
    return BUI_TEMPLATE_RELEASE_URL + "/" + (tag ?  `tags/${tag}` : "latest");
}

// console.log(RELEASES_JSON_PATH)
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
function fetchRelease(version, cb) {
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
    request(url, function (err, res, body) {
        if (err) error(err);
        if (res.statusCode != 200) {
            warn(`Failed to fetch ${url} - ${res.statusCode}: ${res.body}`);
            if (!version) {
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
        newInfo.time = info["published_at"];
        newInfo.path = newInfo.tag;
        let targetPath = path.join(CACHE_TEMPLATE_PATH, newInfo.path);
        if (fs.pathExistsSync(targetPath)) {
            // Probably we are fetching latest release...
            log(`Already cached release.`);
            cb(targetPath);
            return;
        }
        downloadAndUnzip(info["zipball_url"], targetPath, function(){
            releasesInfo[tag] = newInfo;
            jsonfile.writeFileSync(RELEASES_JSON_PATH, releasesInfo, {spaces: 2});
            cb(targetPath);
            return;
        });
    });
}

/**
 * 复制 template 文件以创建 bui 工程.
 * @param  {string} name project name.
 * @param  {string} [version] template version.
 * @param  {string} [templateName] init src/ dir with specified template
 */
function initProject(name, version, templateName) {
    if (fs.existsSync(name)) {
        error(`File ${name} already exist.`);
    }
    log("Creating project...");
    fetchRelease(version, function (releasePath) {
        log("Copying template file...")
        fs.copySync(releasePath, name);
        // 删除模板文件夹
        let templateDir = path.join(name, templateDirName);
        
        log("Project created.");
        if (templateName) {
            log("Initing template...");
            let tPath = path.join(name, templateDirName, templateName);

            if (!fs.existsSync(tPath)) {
                warn(`Template ${templateName} not exist. Using default template.`);
                return
            }
            // 把模板里面的目录,替换public目录
            let srcPath = path.join(name);
            // 删除跟目录
            emptyDir(srcPath)
            // fs.removeSync(srcPath);
            // 复制模板
            fs.copySync(tPath, srcPath);
            log("Copy template done.");
            // 最后删除模板文件夹
            fs.removeSync(templateDir);
        }else{
            // 最后删除模板文件夹
            fs.removeSync(templateDir);
        }
    });
}

// 清空某个文件夹目录
function emptyDir(fileUrl){   

    var files = fs.readdirSync(fileUrl);//读取该文件夹

    for( let i=0; i<files.length; i++){
        var file = files[i];
        var stats = fs.statSync(fileUrl+'/'+file);
        if(stats.isDirectory()  ){
          // templates 目录不删
          // 清空文件,不包含文件夹
          // file !== templateDirName && emptyDir(fileUrl+'/'+file);
          // 清空文件夹,包含文件夹
          file !== templateDirName && fs.removeSync(fileUrl+'/'+file);;
        }else{
          file !== "README.md" && fs.unlinkSync(fileUrl+'/'+file); 
          // log("删除文件"+fileUrl+'/'+file+"成功");
        }  
    }
}

function displayReleases() {
    log("Fetching version info...");
    request.get(BUI_TEMPLATE_RELEASE_URL, function(err, res, body){
        if (err) error(err);
        if (res.statusCode != 200) error(`Failed to fetch releases info - ${res.statusCode}: ${res.body}`);
        let tags = JSON.parse(body).map(function(e){return e["tag_name"]});
        console.log("Available versions:")
        tags.forEach(t => {
            console.log(chalk.green.underline(t));
        })
    });
}

function getAvailableTemplateNames(projectPath) {
    let result = [];
    let tDir = path.join(projectPath, templateDirName);
    if (!fs.existsSync(tDir)) return result;
    let files = fs.readdirSync(tDir);
    for (let f of files) {
        if (fs.statSync(path.join(tDir, f)).isDirectory()) {
            result.push(f);
        }
    }
    return result;
}

var args = yargs
    .command({
        command: "create <name> [version]",
        desc: "Create a bui-weex project. Default to use latest version of template.",
        builder: (yargs) => {
            yargs.option('template', {
                alias: 't',
                describe: 'Init with specified template.'
            })
        },
        handler: function(argv) {
            initProject(argv.name, argv.version, argv.template);
        }
    })
    .command({
        command: "list",
        desc: "List available version of template releases.",
        handler: function() {
            displayReleases();
        }
    })
    .command({
        command: "list-template",
        desc: "List available templates for the newest release.",
        handler: function() {
            fetchRelease(null, (projectPath) => {
                let names = getAvailableTemplateNames(projectPath);
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
    .version() // Use package.json's version
    .help()
    .alias({
        "h": "help",
        "v": "version"
    })
    .strict(true)
    .demandCommand()
    .argv;
