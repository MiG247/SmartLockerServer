var mysql = require('mysql');

//Connection Variables needs to be adjusted !!!
var mysql_db= mysql.createConnection({
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
  console.log('MySQL connected ...');
});

// get manue card
var getManueQuery = mysql_db.query('select * from combo',
function (err, result) {
  if(err){
    console.error(err);
    return;
  }
  console.log(result);
});
