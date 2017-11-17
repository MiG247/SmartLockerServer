'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');
const adminRole = "Admin";

exports.adminRole = adminRole;

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

exports.updatePassword = function(args, res, next) {
  /**
   * Patches the Role password. Only for Admin
   *
   * roleData PatchPassword Information to Change the Password.
   * no response value expected for this operation
   **/
   var adminPassword = escape(args.roleData.value.adminpassword);
   var adminSalt = security.getSalt(adminRole).salt;
   adminPassword = security.sha512(adminPassword, adminSalt).passwordHash;
   var newPassword = escape(args.roleData.value.newpassword);
   var roleName = escape(args.roleData.value.name);

   let verifyAdminQuery = "SELECT name FROM staff WHERE password = \'"+adminPassword+"\';";

   db.mysql_db.query(verifyAdminQuery, (err, rows) =>{
     if (err) {
       return res.end(JSON.stringify({
         status: 500,
         message: err
       }));
     }
     if(rows[0] === undefined){
       return res.end(JSON.stringify({
         status: 406,
         message: "Invalied AdminPassword"
       }));
     }

     let verifyRoleNameQuery = "SELECT name FROM staff WHERE name =\'"+roleName+"\';";
     db.mysql_db.query(verifyRoleNameQuery, (err, rows) =>{
       if (err) {
         return res.end(JSON.stringify({
           status: 500,
           message: err
         }));
       }
       if(rows[0] === undefined){
         return res.end(JSON.stringify({
           status: 404,
           message: "Invalied Rolename"
         }));
       }
       security.saveSaltedHashedPassword(roleName, newPassword, res);
     });
   });
}
