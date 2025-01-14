'use strict';
const mysql = require('mysql2');

const dbConn = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mydb'
});

dbConn.getConnection(function(err, conn) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = dbConn;