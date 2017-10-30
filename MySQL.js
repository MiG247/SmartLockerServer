'use strict';

var mysql = require('mysql');

//Connection Variables needs to be adjusted !!!
var mysql_db = mysql.createConnection({
  host: 'localhost',
  user: 'RobertMarxreiter',
  password: 'test123',
  database: 'mysql_server'
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
