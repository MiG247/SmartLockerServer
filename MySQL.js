'use strict';

var mysql = require('mysql');

//Connection Variables needs to be adjusted !!!
var mysql_db = mysql.createConnection({
  host: 'localhost',
  user: 'maik',
  password: 'test123',
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