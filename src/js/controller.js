const fs = require('fs');
const localStorage = require('local-storage');
const qs = require("qs");
const url = require("url");
const DBConnect = require("../model/databaseModel");

let tokenId;

class Controller {

    constructor() {
        let db = new DBConnect();
        this.conn = db.connect();
    }

    querySQL(sql) {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            })
        })
    }

    showForm(path, res) {
        let data = fs.readFileSync(path, 'utf-8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }

    navigation(res, location) {
        res.writeHead(301, {'Location' : `${location}`});
        res.end();
    }

    login(req, res) {
        if (req.method === "GET") {
            this.showForm('./templates/login.html', res);
        } else {
            let data = '';
            req.on('data' , chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                let newData = qs.parse(data);
                let sql = `SELECT * from users WHERE email = '${newData.email}'`;
                let results = await this.querySQL(sql)
                if (results.length > 0) {
                    if (results[0].role === 'admin' && results[0].password === newData.password) {
                        this.navigation(res, '/dashboard');
                    } else if (results[0].role === 'customer' && results[0].password === newData.password) {
                        tokenId = newData.email;
                        let tokenSession = {email : newData.email, cart : []};
                        fs.writeFileSync('./token/'+tokenId, JSON.stringify(tokenSession), 'utf-8');
                        localStorage.set(`${tokenId}`, tokenId);
                        this.navigation(res, '/home');
                    } else {
                        this.navigation(res, '/login');
                    }
                } else {
                    this.navigation(res, '/login');
                }
            })
        }
    }

    checkSession(req, res) {
        let tokenId = localStorage.get('token');
        if (tokenId) {
            this.home(req, res).then(r => {
            });
        } else {
            this.login(req, res);
        }
    }

    async home(req, res) {
        let sql = 'SELECT * FROM product';
        let results = await this.querySQL(sql)
        let html = '';
        for (let i = 0; i < results.length; i++) {
            html += `<tr>`;
            html += `<td>${i+1}</td>`;
            html += `<td>${results[i].name}</td>`;
            html += `<td>${results[i].price}</td>`;
            html += `<td>${results[i].quantityInStock}</td>`;
            html += `<td>${results[i].description}</td>`;
            html += `<td><a href='/addcart?id=${results[i].pro_id}' type="button" class="btn btn-success">Thêm vào giỏ hàng</a></td>`
            html += `</tr>`;
        }
        let data = fs.readFileSync('./templates/home.html', 'utf-8');
        console.log(data)
        res.setHeader('Cache-Control', 'no-store');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        data = data.replace('{ListProduct}', html);
        res.write(data);
        res.end();
    }

    addCart(req, res){
        let session = fs.readFileSync('./token/' + tokenId, 'utf8');
        let customerEmail = JSON.parse(session).email;
        let customerCart = JSON.parse(session).cart;
        let query = qs.parse(url.parse(req.url).query);
        let productID = +query.id;
        if(customerCart.indexOf(productID) === -1){
            customerCart.push(productID);
        }
        let newSession = {email: customerEmail, cart: customerCart};
        fs.writeFileSync('./token/'+customerEmail, JSON.stringify(newSession));
        res.setHeader('Cache-Control', 'no-store');
        res.writeHead(301, {'Location' : '/home'});
        res.end();
    }

    async cart(req, res) {
        let session = fs.readFileSync('./token/' + tokenId, 'utf8');
        let cart = JSON.parse(session).cart;
        let selectedProId = '';
        for (let i = 0; i < cart.length; i++) {
            selectedProId += `pro_id = ${cart[i]} or `
        }
        selectedProId = selectedProId.slice(0, -3);
        let sql = `SELECT * FROM product WHERE ${selectedProId}`;
        let result = await this.querySQL(sql)
        let html = '';
        result.forEach((item, i) => {
            html += `<tr>`;
            html += `<td><p>${item.name}</p></td>`;
            html += `<td>${item.description}</td>`;
            html += '<td>';
            html += `<form class="form-inline">`;
            html += `<input class="form-control" type="number" value="1" name = '${i}' id = 'quantity${i}' onchange="money()">`
            html += `<a href="#" class="btn btn-primary"><i class="fa fa-trash-o"></i></a>`
            html += `</form>`;
            html += `</td>`;
            html += `<td><span>$</span><span id = 'price${i}'>${item.price}</span></td>`;
            html += `<td><span>$</span><span id = 'total${i}'>${item.price}</span></td>`
            html += `</tr>`
        })
        let data = fs.readFileSync('./templates/cart.html', "utf-8");
        data = data.replace('{input}', html);
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }

    notFound(req, res) {
        this.showForm('./templates/notFound.html', res);
    }

    chat(req, res) {
        this.showForm('./templates/chatting.html', res)
    }

    register(req, res) {
        if (req.method === "GET") {
            this.showForm('./templates/register.html', res);
        } else {
            let data = "";
            req.on('data' , chunk => {
                data += chunk;
            });
            req.on('end' , async () => {
                let newData = qs.parse(data);
                const sql = `SELECT * FROM users WHERE email = '${newData.newEmail}'`
                let results = await this.querySQL(sql);
                    if (results.length > 0) {
                        this.navigation(res, '/register');
                    } else {
                        if (newData.newPassword === newData.newRepeatPassword) {
                            let newUser = {
                                name: newData.newName,
                                email: newData.newEmail,
                                password: newData.newPassword,
                                role: 'customer'
                            }
                            const sql = `INSERT INTO users (name, email, password, role)
                                     VALUES ('${newUser.name}', '${newUser.email}', '${newUser.password}',
                                             '${newUser.role}');`
                            await this.querySQL(sql);
                            this.navigation(res, '/login');
                        }
                    }
            })
        }
    }

    async dashboard(req, res) {
            let sql = 'SELECT * FROM product;';
            let results = await this.querySQL(sql);
            let html = '';
            for (let i = 0; i < results.length; i++) {
                html += `<tr>`;
                html += `<td>${i+1}</td>`;
                html += `<td>${results[i].name}</td>`;
                html += `<td>${results[i].price}</td>`;
                html += `<td>${results[i].quantityInStock}</td>`;
                html += `<td>${results[i].description}</td>`;html += `<td><a class="btn btn-success" href="/admin/update?id=${results[i].pro_id}">Sửa</a></td>`
                html += `<td><a class="btn btn-danger" href="/admin/delete?id=${results[i].pro_id}">Xóa</a></td>`
                html += `</tr>`;
            }
            let data = fs.readFileSync('./templates/dashboard.html', 'utf8');
            res.writeHead(200, {'Content-Type' : 'text/html'});
            data = data.replace('{ListProduct}', html);res.write(data);
            res.end();
    }

    createProduct(req, res) {
        if (req.method === "GET") {
            this.showForm('./templates/create.html', res);
        } else {
            let data = '';
            req.on('data' , chunk => {
                data += chunk;
            })
            req.on('end', async () => {
                let newData = qs.parse(data);
                const sql = `INSERT INTO product (name, price, quantityInStock, description) VALUES ('${newData.nameProduct}',${+newData.priceProduct}, ${+newData.quantityProduct}, '${newData.description}')`
                await this.querySQL(sql)
                this.navigation(res, '/dashboard')
            })
        }
    }

    async deleteProduct(req, res) {
        const id = +qs.parse(url.parse(req.url).query).id;
        let sql = `DELETE FROM product WHERE pro_id = ${id}`;
        await this.querySQL(sql);
        this.navigation(res, '/dashboard');
    }

    async updateProduct(req, res) {
        const id = +qs.parse(url.parse(req.url).query).id;
        if (req.method === 'GET') {
            let sql = `SELECT * FROM product WHERE pro_id = ${id}`
            let result = await this.querySQL(sql);
            let data = fs.readFileSync('./templates/update.html', 'utf-8')
            data = data.replace(`<input type="text" class="form-control" name="nameProduct" id="exampleInput" style="margin-left: 20px">`, `<input type="text" class="form-control" name="nameProduct" id="exampleInput" style="margin-left: 20px" value="${result[0].name}">`)
            data = data.replace(`<input type="number" class="form-control" name="priceProduct" id="exampleInputPrice" style="margin-left: 20px">`, `<input type="number" class="form-control" name="priceProduct" id="exampleInputPrice" style="margin-left: 20px" value="${result[0].price}">`)
            data = data.replace(`<input type="number" class="form-control" name="quantityProduct" id="exampleInputStock" style="margin-left: 20px">`, `<input type="number" class="form-control" name="quantityProduct" id="exampleInputStock" style="margin-left: 20px" value="${result[0].quantityInStock}">`)
            data = data.replace(`<input type="text" class="form-control" name="description" id="exampleInputBrief" style="margin-left: 20px">`, `<input type="text" class="form-control" name="description" id="exampleInputBrief" style="margin-left: 20px" value="${result[0].description}">`)
            res.writeHead(200, {'Content-Type' : 'text/html'})
            res.write(data)
            res.end()
        } else {
            let data = '';
            req.on('data' , chunk => {
                data += chunk;
            })
            req.on('end', async () => {
                let newData = qs.parse(data);
                let sql = `UPDATE product SET name = '${newData.nameProduct}', price = ${+newData.priceProduct}, quantityInStock = ${+newData.quantityProduct}, description = '${newData.description}' WHERE pro_id = ${id}`
                await this.querySQL(sql);
                res.writeHead(301, {'Location' :'/dashboard'})
                res.end()
                })
            }
        }

    async searchProduct(req, res) {
        let keyword = qs.parse(url.parse(req.url).query).keyword;
        const sql = `SELECT *
                     FROM product
                     WHERE name LIKE '%${keyword}%'`
        let result = await this.querySQL(sql)
        let html = '';
        if (result.length > 0) {
            result.forEach((item, index) => {
                html += '<tr>'
                html += `<td>${index + 1}</td>`
                html += `<td>${item.name}</td>`
                html += `<td>${item.price}</td>`
                html += `<td>${item.quantityInStock}</td>`
                html += `<td>${item.description}</td>`
                html += `<td><a class="btn btn-success" href="/admin/update?id=${+item.pro_id}">Sửa</a></td>`
                html += `<td><a class="btn btn-danger" href="/admin/delete?id=${+item.pro_id}">Xóa</a></td>`
                html += '</tr>'
            })
        } else {
            html += '<tr>'
            html += `<td colspan="7" class="text-center">Không có dữ liệu</td>`
            html += '</tr>'
        }
        let data = fs.readFileSync('./templates/dashboard.html', 'utf-8')
        data = data.replace('{ListProduct}', html)
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(data)
        res.end()
    }
}

module.exports = Controller;