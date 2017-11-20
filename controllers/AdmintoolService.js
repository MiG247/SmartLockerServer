'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');
const adminRole = "Admin";

exports.adminRole = adminRole;

exports.getFoods = function(args, res, next) {
  /**
   * Returns a food Array. Only for Admin
   *
   * size Integer Size of array to receive (optional)
   * offset Integer Start index of the source (optional)
   * returns List
   **/

}
exports.getCombos = function(args, res, next) {
  /**
   * Returns a combo Array. Only for Admin
   *
   * size Integer Size of array to receive (optional)
   * offset Integer Start index of the source (optional)
   * returns List
   **/
   let getCombosQuery = 'SELECT * FROM combo;';

   db.mysql_db.query(getCombosQuery, (err, rows) => {
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     if (rows[0] === undefined) {
       return security.responseMessage(res, 404, "No data found on the Database");
     }
     for (var i = 0; i < rows.length; i++) {
       //rows[i]
     }
   });
}

exports.addCombo = function(args, res, next) {
  /**
   * Post a new Combo entry. Only for Admin
   *
   * combo AdmintoolCombo Information to add a new Combo.
   * no response value expected for this operation
   **/
}

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
      return security.responseMessage(res, 500, err);
    }
    if (rows[0] === undefined) {
      return security.responseMessage(res, 404, "No data found on the Database");
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
       return security.responseMessage(res, 500, err);
     }
     if(rows[0] === undefined){
       return security.responseMessage(res, 406, "Invalied AdminPassword");
     }

     let verifyRoleNameQuery = "SELECT name FROM staff WHERE name =\'"+roleName+"\';";
     db.mysql_db.query(verifyRoleNameQuery, (err, rows) =>{
       if (err) {
         return security.responseMessage(res, 500, err);
       }
       if(rows[0] === undefined){
         return security.responseMessage(res, 404, "Invalied Rolename");
       }
       security.saveSaltedHashedPassword(roleName, newPassword, res);
     });
   });
}

exports.addCombo = function(args, res, next) {
  /**
   * Post a new Combo entry. Only for Admin
   *
   * combo Combo Information to add a new Combo.
   * no response value expected for this operation
   **/
  var combo_name = escape(args.combo.value.combo_name);
  var combo_price = escape(args.combo.value.combo_price);
  var combo_available = escape(args.combo.value.combo_available);
  var combo_photo = escape(args.combo.value.photo);
  var combo_food = escape(args.combo.vlaue.combo_food);

  console.log(combo_food);

  let insertComboQuery = 'INSERT INTO combo (name, price, combo_available, photo) \
  VALUES(\''+combo_name+'\','+combo_price+','+combo_available+',\''+combo_photo+'\');';
  db.mysql_db.query(insertComboQuery, (err) =>{
    if (err) {
      return security.responseMessage(res, 500, err);
    }
    return security.responseMessage(res, 200, "Successfully posted new Combo.");
  });
}

exports.deleteCombo = function(args, res, next) {
  /**
   * Delete a Combo entry. Only for Admin
   *
   * combo Combo Information to add a new Combo.
   * no response value expected for this operation
   **/
  var combo_id = escape(args.combo.value.combo_id);

  let deleteComboQuery =  'DELETE FROM food_combo WHERE combo_id ='+combo_id+'; \
  DELETE FROM combo WHERE id = '+combo_id+';';

  db.mysql_db.query(deleteComboQuery, (err)=>{
    if (err) {
      return security.responseMessage(res, 500, err);
    }
    return security.responseMessage(res, 200, "Successfully deleted combo with the id:"+combo_id+".");
  });
}

exports.update_Combo = function(args, res, next) {
  /**
   * Update a Combo entry. Only for Admin
   *
   * combo Combo Information to update Combo.
   * no response value expected for this operation
   **/
  var combo_id = escape(args.combo.value.combo_id);
  var combo_name = escape(args.combo.value.combo_name);
  var combo_price = escape(args.combo.value.combo_price);
  var combo_available = escape(args.combo.value.combo_available);
  var combo_photo = escape(args.combo.value.photo);

  let updateComboQuery = 'UPDATE combo SET name = \''+combo_name+'\', price =\
    '+combo_price+', combo_available = '+combo_available+', photo = \
    \''+combo_photo+'\' WHERE id = '+combo_id;
  db.mysql_db.query(updateComboQuery, (err) =>{
     if(err){
       return security.responseMessage(res, 500, err);
     }
     return security.responseMessage(res, 200, "Successfully updated Combo with the id:"+combo_id+".");
  });
}
