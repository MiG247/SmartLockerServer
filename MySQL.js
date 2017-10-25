'use strict';

var mysql = require('mysql');

//Connection Variables needs to be adjusted !!!
/*
var mysql_db = mysql.createConnection({
  host: 'localhost',
  user: 'maik',
  password: 'test123',
  database: 'smartlocker_db'
});
*/
var mysql_db = mysql.createConnection({
  host: 'dokku-mysql-smartlocker-db',
  port: 3306,
  user: 'mysql',
  password: '5cd207bf82a60c0d',
  database: 'smartlocker_db'
});

// Connect to DB
mysql_db.connect((err) => {
    if(err){
      throw err;
    }
    console.log('MySQL Database connected ...');
    return;
  });

exports.mysql_db = mysql_db;
