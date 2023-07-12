const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const hostname = os.networkInterfaces().Ethernet[1].address; // If this doesn't work, put in your LAN IP to this computer (Use ipconfig in CMD)
const port = 420;
const server = http.createServer((req, res) => { 
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; 
    console.log(`[Incoming GET Request] : ${ip}`); 
    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == '/') 
            fileUrl = './Dashboard.html';
        else fileUrl = req.url;
        var filePath = path.resolve('./' + fileUrl);
        const fileExt = path.extname(filePath);
        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    filePath = path.resolve('./Dashboard.html');
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.css') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/css');
            fs.createReadStream(filePath).pipe(res);
        }else if (fileExt == '.js') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/javascript');
            fs.createReadStream(filePath).pipe(res);
        }else if (fileExt == '.mp3') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'audio/mpeg');
            fs.createReadStream(filePath).pipe(res);
        }else {
            filePath = path.resolve('./Dashboard.html');
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        }
    }else {
        filePath = path.resolve('./Dashboard.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
    }
});
server.listen(port, hostname, () => { console.log(`API Requester v1 - Natioanl Weather Service : Running at http://${hostname}:${port}/`); });