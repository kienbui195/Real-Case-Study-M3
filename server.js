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

    const urlPath = url.parse(req.url);
    switch (urlPath.pathname) {
        case '/':
            controller.checkSession(req, res);
            break;
        case '/home':
            controller.home(req, res);
            break;
        case '/cart':
            controller.cart(req, res);
            break;
        case '/login':
            controller.login(req, res);
            break;
        case '/register':
            controller.register(req, res);
            break;
        case '/chat':
            controller.chat(req, res);
            break;
        case '/dashboard':
            controller.dashboard(req, res);
            break;
        case '/create':
            controller.create(req, res);
            break;
        case '/update':
            if (urlPath.pathname === '/update') {
                const query = qs.parse(url.parse(req.url).query);
                controller.update(req, res, +query.id);
            }
            break;
        case '/delete':
            if (urlPath.pathname === '/delete') {
                const query = qs.parse(url.parse(req.url).query);
                controller.delete(req, res, +query.id);
            }
            break;
        default:
            controller.notFound(req, res);
            break;
    }
})




    httpServer.listen(port, 'localhost', () => {
    console.log(`Server is running at http://localhost:${port}`);
});

