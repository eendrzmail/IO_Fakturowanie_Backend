const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'b31eaabfb69a6b',
    password: 'e34d98f9',
    database: 'heroku_d6d6ab2d50fa0a4',
    port: '3306'
});

module.exports= pool;
