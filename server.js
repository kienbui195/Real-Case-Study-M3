const http = require('http');
const port = 8080;
const url = require('url');
const qs = require('qs');
const {Server} = require('socket.io')


const httpServer = http.createServer((req, res) => {
    const path = req.url;

    switch (path) {
        case '/':
            break;
        case '/login':
            break;
        case '/register':
            break;
        default:
            res.end();
    }
}).listen(port, 'localhost', () => {
    console.log(`Server is running at http:localhost:${port}`);
});