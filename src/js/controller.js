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
                connection.connect(() => {
                    let flag = false;
                    const sql = `SELECT * FROM users WHERE email = '${newData.newEmail}'`
                    connection.query(sql, (err, result) => {
                        if (result.length > 0) {
                            flag = true;
                        }
                        if (newData.newPassword === newData.newRepeatPassword && flag === false) {
                            let newUser = {
                                name: newData.newName,
                                email: newData.newEmail,
                                password: newData.newPassword,
                                role : 'customer'
                            }
                            const sql = `INSERT INTO users (name, email, password, role) VALUES ('${newUser.name}','${newUser.email}','${newUser.password}', '${newUser.role}');`
                            connection.query(sql, (err) => {
                                if (err) {
                                    console.log(err)
                                }
                            })
                            res.writeHead(301, {'Location' : '/login'});
                            res.end();
                        } else {
                            res.writeHead(301, {'Location' : '/register'});
                            res.end();
                        }
                    })
                })
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
                    html += `<td><a class="btn btn-success" href="/update?id=${results[i].pro_id}">Sửa</a></td>`
                    html += `<td><a class="btn btn-danger" href="/delete?id=${results[i].pro_id}">Xóa</a></td>`
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

    create(req, res) {
        if (req.method === "GET") {
            let data = fs.readFileSync('./templates/create.html', '')
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        } else {
            let data = '';
            req.on('data' , chunk => {
                data += chunk;
            })
            req.on('end', () => {
                let newData = qs.parse(data);
                connection.connect(() => {
                    console.log(newData)
                    const sql = `INSERT INTO product (name, price, quantityInStock, description) VALUES ('${newData.nameProduct}',${+newData.priceProduct}, ${+newData.quantityProduct}, '${newData.description}')`
                    connection.query(sql, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    res.writeHead(301, {'Location' : '/dashboard'})
                    res.end();
                })
            })
        }
    }

    delete(req, res, id) {
        connection.connect(() => {
            let sql = `DELETE FROM product WHERE pro_id = ${id}`
            connection.query(sql, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            res.writeHead(301, {'Location' : '/dashboard'})
            res.end();
        })
    }

    update(req, res, id) {
        if (req.method === 'GET') {
            connection.connect(() => {
                let sql = `SELECT * FROM product WHERE pro_id = ${id}`
                connection.query(sql, (err, result) => {
                    let data = fs.readFileSync('./templates/update.html', 'utf-8')
                    data = data.replace(`<input type="text" class="form-control" name="nameProduct" id="exampleInput" style="margin-left: 20px">`, `<input type="text" class="form-control" name="nameProduct" id="exampleInput" style="margin-left: 20px" value="${result[0].name}">`)
                    data = data.replace(`<input type="number" class="form-control" name="priceProduct" id="exampleInputPrice" style="margin-left: 20px">`, `<input type="number" class="form-control" name="priceProduct" id="exampleInputPrice" style="margin-left: 20px" value="${result[0].price}">`)
                    data = data.replace(`<input type="number" class="form-control" name="quantityProduct" id="exampleInputStock" style="margin-left: 20px">`, `<input type="number" class="form-control" name="quantityProduct" id="exampleInputStock" style="margin-left: 20px" value="${result[0].quantityInStock}">`)
                    data = data.replace(`<input type="text" class="form-control" name="description" id="exampleInputBrief" style="margin-left: 20px">`, `<input type="text" class="form-control" name="description" id="exampleInputBrief" style="margin-left: 20px" value="${result[0].description}">`)
                    res.writeHead(200, {'Content-Type' : 'text/html'})
                    res.write(data)
                    res.end()
                })
            })
        } else {
            let data = '';
            req.on('data' , chunk => {
                data += chunk;
            })
            req.on('end', () => {
                connection.connect(() => {
                    let newData = qs.parse(data);
                    let sql = `UPDATE product SET name = '${newData.nameProduct}', price = ${+newData.priceProduct}, quantityInStock = ${+newData.quantityProduct}, description = '${newData.description}' WHERE pro_id = ${id}`
                    connection.query(sql, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    res.writeHead(301, {'Location' :'/dashboard'})
                    res.end()
                })

            })
        }
    }
}

module.exports = Controller;