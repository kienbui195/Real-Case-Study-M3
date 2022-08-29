const fs = require('fs');
const mysql = require('mysql');
const connection = require('../js/connecttoDatabase.js');
const qs = require("qs");

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
        connection.connect(() => {
            let sql = 'SELECT * FROM product';
            connection.query(sql, (err, results) => {
                let html = '';
                for (let i = 0; i < results.length; i++) {
                    html += `<tr>`;
                    html += `<td>${i+1}</td>`;
                    html += `<td>${results[i].name}</td>`;
                    html += `<td>${results[i].price}</td>`;
                    html += `<td>${results[i].quantityInStock}</td>`;
                    html += `<td>${results[i].description}</td>`;
                    html += `<td><button type="button" class="btn btn-success">Thêm vào giỏ hàng</button></td>`
                    html += `</tr>`;
                }
                let data = fs.readFileSync('./templates/home.html', 'utf8');
                res.writeHead(200, {'Content-Type' : 'text/html'});
                data = data.replace('{ListProduct}', html);
                res.write(data);
                res.end();
            })
        })
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
                connection.connect(() => {
                    let sql = `CALL isEmail('${newData.email}', @flag)`;
                    connection.query(sql, (err, result) => {
                        if (result.affectedRows > 0) {
                            res.writeHead(301 , {'Location' : '/register'})
                            res.end();
                        }
                    })
                })
                if (newData.newPassword === newData.newRepeatPassword) {
                    let newUser = {
                        name: newData.newName,
                        email: newData.newEmail,
                        password: newData.newPassword
                    }
                    connection.connect(() => {
                        console.log(`Connect success`)
                        const sql = `INSERT INTO customer (name, email, password) VALUES ('${newUser.name}','${newUser.email}','${newUser.password}');`
                        connection.query(sql, (err) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    })
                    res.writeHead(301, {'Location' : '/home'});
                    res.end();
                }
                res.writeHead(301, {'Location' : '/register'})
                res.end();
            })
        }
    }
}

module.exports = Controller;