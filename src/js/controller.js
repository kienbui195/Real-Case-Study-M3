const fs = require('fs');
const mysql = require('mysql');
const connection = require('../js/connecttoDatabase.js');
const localStorage = require('local-storage');
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
                connection.connect(()=>{
                    let sql = `SELECT * from users WHERE email = '${newData.email}'`;
                    connection.query(sql, (err, results) => {
                        console.log(results[0].password);
                        console.log(newData.password);
                        if(results.length > 0) {
                            if(results[0].role === 'admin' && results[0].password === newData.password){
                                res.writeHead(301, {'Location': '/dashboard'})
                                res.end();
                            }else if(results[0].role === 'customer' && results[0].password === newData.password) {
                                let tokenId = Date.now();
                                let tokenSession = `{email:${newData.email}, password:${newData.password}}`;
                                fs.writeFileSync('./token/'+tokenId, tokenSession);
                                localStorage.set('token', tokenId);
                                res.writeHead(301, {'Location' : '/home'})
                                res.end();
                            }else {
                                res.writeHead(301, {'Location' : '/login'})
                                res.end();
                            }
                        }else {
                            res.writeHead(301, {'Location' : '/login'})
                            res.end();
                        }

                    });
                })
            })
        }
    }

    checkSession(req, res) {
        let tokenID = localStorage.get('token');
        if (tokenID) {
            let sessionString = '';
            let session = fs.readFileSync('./token/' + tokenID, 'utf8');
            sessionString = String(session);
            this.home(req, res);
        }else{
            this.login(req, res);
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
                    html += `<td><a href='/proid=${results[i].pro_id}' type="button" class="btn btn-success">Thêm vào giỏ hàng</a></td>`
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

    cart(req, res) {
        let data = fs.readFileSync('./templates/cart.html', "utf-8");
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
                if (newData.newPassword === newData.newRepeatPassword) {
                    let newUser = {
                        name: newData.newName,
                        email: newData.newEmail,
                        password: newData.newPassword,
                        role : 'customer'
                    }
                    connection.connect(() => {
                        console.log(`Connect success`)
                        const sql = `INSERT INTO customer (name, email, password, role) VALUES ('${newUser.name}','${newUser.email}','${newUser.password}', '${newUser.role}');`
                        connection.query(sql, (err) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    })
                    res.writeHead(301, {'Location' : '/login'});
                    res.end();
                }
                res.writeHead(301, {'Location' : '/register'})
                res.end();
            })
        }
    }

    dashboard(req, res) {
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
                    html += `<td><button type="button" class="btn btn-success">Sửa</button></td>`
                    html += `<td><button type="button" class="btn btn-success">Xóa</button></td>`
                    html += `</tr>`;
                }
                let data = fs.readFileSync('./templates/dashboard.html', 'utf8');
                res.writeHead(200, {'Content-Type' : 'text/html'});
                data = data.replace('{ListProduct}', html);
                res.write(data);
                res.end();
            })
        })
    }
}

module.exports = Controller;