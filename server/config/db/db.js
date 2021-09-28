const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    debug: false,
});

pool.getConnection((error, connection) => {
    if (error) {
        console.error('connection error to mysql database!');
        return;
    }
    console.log('Connected to mysql database');
});
module.exports = pool;
