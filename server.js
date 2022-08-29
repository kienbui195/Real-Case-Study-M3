const http = require('http');
const port = 8080;
const url = require('url');
const qs = require('qs');
const {Server} = require('socket.io');
const Controller = require("./src/js/controller");
const fs = require("fs");

const controller = new Controller();

const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "png": "image/png",
    "jpg": "image/jpeg"
};

const httpServer = http.createServer((req, res) => {
    const filesDefences = req.url.match(/\.js|.css|\.png|\.jpg/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
       res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + "/" + req.url).pipe(res)
    }

    const path = req.url;

    switch (path) {
        case '/':
            controller.home(req, res);
            break;
        case '/login':
            controller.login(req, res);
            break;
        case '/register':
            break;
        default:
            controller.notFound(req, res);
            break;
    }
}).listen(port, 'localhost', () => {
    console.log(`Server is running at http:localhost:${port}`);
});