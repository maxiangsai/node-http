/**
 * Created by sai on 2017/4/30.
 */
var http = require('http')
var url = require('url')
var fs = require('fs')
var qs = require('querystring')

var port = '3000';
var server = http.createServer(function (req, res) {
    if(validateSource(req)){
        parseParam(req);
        readStaticFile(req, res);

    }else {
        res.writeHead('400', {'Content-Type': 'text/plain: charset=utf-8'})
        res.write('not found')
        res.end()
    }
}).listen(port)


/**
 * 验证请求资源是否存在
 * @param req
 * @returns {boolean}
 */
function validateSource(req) {
    var pathname = url.parse(req.url, true).pathname;
    var extname = pathname.substring(pathname.indexOf('.'));
    return '.html.gif.jpg.jpeg.png.css.js'.indexOf(extname) >= 0
}

/**
 * 解析请求参数
 * @param req
 */
function parseParam(req) {
    var method = req.method;
    if(method.toUpperCase() === 'POST') {
        var postData = '';
        req.on('data', function (data) {
            postData += data;
        });
        req.on('end', function () {
            req.param = qs.parse(postData)
            console.log('post: ',req.param)
        })
    }
    else if(method.toUpperCase() === 'GET') {
        req.param = url.parse(req.url, true).query;
        console.log('get: ',req.param)
    }
}


/**
 * 读取静态文件
 * @param req
 * @param res
 */
function readStaticFile(req, res) {
    var pathname = url.parse(req.url, true).pathname;
    if(fs.existsSync(__dirname + pathname)) {
        fs.createReadStream(__dirname + pathname).pipe(res)
    }else {
        res.writeHead('400', {'Content-Type': 'text/plain: charset=utf-8'})
        res.write('not found')
        res.end()
    }
}