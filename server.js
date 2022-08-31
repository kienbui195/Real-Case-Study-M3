const http = require('http');
const port = 8080;
const url = require('url');
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
        fs.createReadStream(__dirname + "/" + req.url).pipe(res);
    }

    const urlPath = url.parse(req.url);

    switch (urlPath.pathname) {
        case '/':
            controller.checkSession(req, res);
            break;
        case '/home':
            controller.home(req, res).then(r => {});
            break;
        case '/addcart':
            controller.addCart(req, res);
            break;
        case '/customer/cart':
            controller.cart(req, res).then(r => {});
            break;
        case '/login':
            controller.login(req, res);
            break;
        case '/register':
            controller.register(req, res);
            break;
        case '/chat':
            controller.chat(req, res, httpServer);
            break;
        case '/dashboard':
            controller.dashboard(req, res).then(r => {});
            break;
        case '/admin/create':
            controller.createProduct(req, res);
            break;
        case '/admin/update':
            controller.updateProduct(req, res).then(r => {});
            break;
        case '/admin/delete':
            controller.deleteProduct(req, res).then(r => {});
            break;
        case '/admin/search':
            controller.searchProduct(req, res).then(r => {});
            break;
        case '/customer/search':
            controller.customerSearch(req, res);
            break;
        default:
            controller.notFound(req, res);
            break;
    }
})

httpServer.listen(port, 'localhost', () => {
    console.log(`Server is running at http://localhost:${port}`);
});

