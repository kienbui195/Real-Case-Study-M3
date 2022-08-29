const fs = require('fs');
const connection = require('../js/connecttoDatabase.js');

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
}

module.exports = Controller;