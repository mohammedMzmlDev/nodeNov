'use strict';

const mysql = require('mysql');

const dbConn = mysql.createConnection({
    host     : 'localhost',
    user     : 'newuser',
    password : 'password',
    database : 'nodeone'
});
dbConn.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  });
module.exports = dbConn;
// ALTER USER 'newuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';