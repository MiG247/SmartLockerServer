'use strict';

var mysql = require('mysql');
/*
Server Database Connection
needs to be adjusted, if you set up a new 
Container
*/
var mysql_db = mysql.createConnection({
  host: 'dokku-mysql-smartlocker-db',
  port: 3306,
  user: 'mysql',
  password: 'fe3cf2b05c616972',
  database: 'smartlocker_db',
  multipleStatements: true
});

//connect to the DB
mysql_db.connect((err) => {
      if(err){
        throw err;
      }
      console.log('MySQL Database connected ...');
      return;
});

exports.mysql_db = mysql_db;
