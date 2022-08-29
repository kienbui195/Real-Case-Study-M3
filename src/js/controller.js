const fs = require('fs');
const qs = require('qs');
const mysql = require('mysql');
const connection = require("../js/connecttoDatabase.js");


class Controller {

    login(req, res) {
        if (req.method === "GET") {
            let data = fs.readFileSync('./templates/login.html', 'utf8');
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        } else {
            let data = '';
            req.on('data' , chunk => {
                data += chunk;
            });
            req.on('end', () => {
                let newData = qs.parse(data);

            })
        }
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
        if (req.method === "GET") {
            let data = fs.readFileSync('./templates/register.html', 'utf-8');
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        } else {
            let data = "";
            req.on('data' , chunk => {
                data += chunk;
            });
            req.on('end' , () => {
                let newData = qs.parse(data);
                if (newData.password === newData.newRepeatPassword) {
                    let newUser = {
                        name: newData.name,
                        email: newData.email,
                        password: newData.password
                    }

                    connection.connect()
                    // connectDatabase();
                    // const sql = `INSERT TABLE (name, email, password) VALUES (${newUser.name},${newUser.email},${newUser.password})`
                    // connection.query(sql, (err, result) => {
                    //     if (err) {
                    //         console.log(err)
                    //     }
                    // })
                    res.writeHead(301, {'Location' : '/home'});
                    res.end();
                }

            })
        }

    }
}

module.exports = Controller;