const fs = require('fs');

class Controller {
    constructor() {
    }

    login(req, res) {
        let data = fs.readFileSync('./templates/login.html', 'utf8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }

    home(req, res) {
        let data = fs.readFileSync('./templates/home.html', 'utf8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }



    notFound(req, res) {
        let data = fs.readFileSync('./templates/notFound.html', "utf-8");
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }

    chat(req, res) {
        let data = fs.readFileSync('./templates/chatting.html', 'utf-8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }

    register(req, res) {
        let data = fs.readFileSync('./templates/register.html', 'utf-8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }
}

module.exports = Controller;