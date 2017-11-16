'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');
const adminRole = "Admin";

exports.getStaff = function(args, res, next) {
  /**
   * Returns a Array of all Server Roles
   *
   * size Integer Size of array to receive (optional)
   * offset Integer Start index of the source (optional)
   * returns List
   **/
  let getStaffquery = "SELECT name, admin FROM staff"

  db.mysql_db.query(getStaffquery, (err, rows) =>{
    if (err) {
      return res.end(JSON.stringify({
        status: 500,
        message: err
      }));
    }
    if (rows[0] === undefined) {
      return res.end(JSON.stringify({
        status: 404,
        message: "No data found on the Database."
      }));
    }
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(rows));
  });
}
