/**
 * server_node JS
 * server
 * 2018-08-15
 */

var myIP = "192.168.1.106"; //ip 地址
var myPort = 8888; //端口号
var defaultFile = "index.html";
//需要缓存的文件类型
var cacheFile = /^(.gif|.jpeg|.png|.jpg|.svg|.swf|.ico|.js|.css|.mp3|.wav)$/ig;
var cacheTime = 16e9; //缓存时间，半年多

var Http = require('http'),
        Url = require("url"),
        Path = require('path'),
        Zlib = require('zlib'),
        Stream = require('stream'),
        Fs = require('fs');

var Server = Http.createServer(onRequest);
Server.listen(myPort, myIP);
console.log('Server running at http://' + myIP + ':' + myPort + '/');

function onRequest(req, res) {
    if (req.url.indexOf('/ajax') === 0)
        return ajaxResponse(req, res);  //进入ajax数据处理
    var filePath = getFilePath(req, res);
    fileSystem(req, res, filePath);
}
function ajaxResponse(req, res) {
    if (req.method === 'POST')
        return dataStream(req, function (data) {
            toResponse(req, res, 'you send:\n' + data);
        });
    toResponse(req, res, 'Welcome to nodejs ajax center');

    function dataStream(req, callback) {
        var data = "";
        req.addListener('data', function (chunk) {
            data += chunk;
        });
        req.addListener('end', function () {
            callback(data);
        });
    }
    function toResponse(req, res, data) {
        res.setHeader("Access-Control-Allow-Origin", "*");  //cross domain
        res.setHeader("Content-Type", "text/plain");

        var acceptEncoding = req.headers['accept-encoding'];
        !acceptEncoding && (acceptEncoding = '');
        if (acceptEncoding.match(/\bgzip\b/)) {
            res.writeHead(200, {'Content-encoding': 'gzip'});
            enGzip(res, data, 'createGzip');
        } else if (acceptEncoding.match(/\bdeflate\b/)) {
            res.writeHead(200, {'Content-encoding': 'deflate'});
            enGzip(res, data, 'createDeflateRaw');
        } else {
            res.writeHead(200, {});
            enGzip(res, data);
        }
    }
    function enGzip(xhr, dataStr, func) {
        var raw = new Stream.Readable();
        raw._read = function noop() {
        };
        raw.push(dataStr);
        raw.push(null);
        if (!func)
            return raw.pipe(xhr);
        raw.pipe(Zlib[func]()).pipe(xhr);
    }
}
function getFilePath(req, res) { //获取服务器本地文件路径
    var pathname = Url.parse(decodeURI(req.url), true).pathname;
    if (pathname.slice(-1) === '/') //访问路径默认添加文件
        pathname += defaultFile;
    //__dirname全局变量，当前文件本地文件夹地址
    return Path.join(__dirname, pathname); //拼接路径
}
function fileSystem(req, res, filePath) {
    //检查路径是否存在
    Fs.stat(filePath, function (err, stats) {
        if (err) { //无效路径，返回404页面
            filePath = Path.join(__dirname, "/404.html");
            return fsResponse(req, res, filePath);
        }
        if (stats.isDirectory()) {
            //如果是文件夹，拼接默认文件名后重定向一下
            res.writeHead(301, {
                Location: Path.join(req.url, '/', defaultFile)
            });
            return res.end();
        }
        fsResponse(req, res, filePath, stats);
    });
}
function fsResponse(req, res, filePath, stats) { //响应文件请求
    //设置返回内容类型
    var ext = Path.extname(filePath.split("?")[0]);
    var contentType = getValidExtensions(ext) || "text/plain";
    res.setHeader("Content-Type", contentType);

    var lastModified = stats.mtime.toUTCString();
    var ifModifiedSince = "If-Modified-Since".toLowerCase();
    res.setHeader("Last-Modified", lastModified);

    if (ext.match(cacheFile)) {
        var expires = new Date();
        expires.setTime(expires.getTime() + cacheTime);
        res.setHeader("Expires", expires.toUTCString());
        res.setHeader("Cache-Control", "max-age=" + cacheTime);
    }
    if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
        res.writeHead(304, "Not Modified");
        res.end();
    } else {
        rangeResponse(req, res, filePath, stats);
    }
}
function rangeResponse(req, res, filePath, stats) {
    //告诉请求方，我们支持Range
    res.setHeader('Accept-Ranges', 'bytes');
    var headerRange = req.headers['range'];
    if (!headerRange)
        return gzipResponse(req, res, filePath);
    var range = getRange(headerRange, stats.size);

    if (range) {
        res.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
        res.setHeader("Content-Length", (range.end - range.start + 1));
        //服务器已经成功处理了部分GET请求。
        gzipResponse(req, res, filePath, 206, range);
    } else {
        res.removeHeader("Content-Length");
        //如果请求中包含了Range请求头，并且Range中指定的任何数据范围都与当前资源的可用范围不重合，
        //同时请求中又没有定义If-Range请求头，那么服务器就应当返回416状态码。
        gzipResponse(req, res, filePath, 416, range);
    }

    function getRange(headerRange, size) {
        var ary = headerRange.split('bytes=');
        var valStr = (ary.length === 2) ? ary[1] : ary[0];
        if (valStr.indexOf(',') !== -1)
            return;
        var range = valStr.split("-"),
                start = parseInt(range[0], 10),
                end = parseInt(range[1], 10);
        if (isNaN(start)) {
            start = size - end;
            end = size - 1;
        } else if (isNaN(end)) {
            end = size - 1;
        }
        if (isNaN(start) || isNaN(end) || start > end || end > size)
            return;
        return {start: start, end: end};
    }
}
function gzipResponse(req, res, filePath, code, opt) {
    !code && (code = 200);
    var raw = Fs.createReadStream(filePath, opt);
    var acceptEncoding = req.headers['accept-encoding'];
    !acceptEncoding && (acceptEncoding = '');
    if (acceptEncoding.match(/\bgzip\b/)) {
        res.writeHead(code, {'Content-encoding': 'gzip'});
        raw.pipe(Zlib.createGzip()).pipe(res);
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.writeHead(code, {'Content-encoding': 'deflate'});
        raw.pipe(Zlib.createDeflateRaw()).pipe(res);
    } else {
        res.writeHead(code);
        raw.pipe(res);
    }
}
function getValidExtensions(ext) {
    var validExtensions = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".ico": "image/x-icon",
        ".jpeg": "image/jpeg",
        ".json": "application/json",
        ".pdf": "application/pdf",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".gif": "image/gif",
        ".png": "image/png",
        ".swf": "application/x-shockwave-flash",
        ".tiff": "image/tiff",
        ".wav": "audio/x-wav",
        ".wma": "audio/x-ms-wma",
        ".wmv": "video/x-ms-wmv",
        ".xml": "text/xml",
        ".mp3": "audio/mp3"
    };
    return validExtensions[ext];
}