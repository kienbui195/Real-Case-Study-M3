const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Abcd1234",
    port: 3306,
    database: "CaseM3"
});

connection.connect(() => {
    console.log("Connected to database");
})

module.exports = connection;