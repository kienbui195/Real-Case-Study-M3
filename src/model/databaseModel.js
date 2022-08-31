const mysql = require('mysql');

class DBConnect {
    constructor() {
        this.host =  "localhost";
        this.user = "root";
        this.password = "Abcd1234";
        this.port = 3306;
        this.database = "CaseM3"
    }

    connect() {
        return mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            port: this.port,
            database: this.database
        })
    }
}

module.exports = DBConnect;