'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');
const adminRole = "Admin";

exports.adminRole = adminRole;

exports.addFood = function(args, res, next) {
  /**
   * Post a new Food entry. Only for Admin
   *
   * food AdmintoolFood Information to add a new Food.
   * no response value expected for this operation
   **/
   var food_name = escape(args.food.value.food_name);
   var food_ingredient = args.food.value.food_ingredient;

   let insertFoodQuery = 'INSERT INTO food (name) \
   VALUES(\''+food_name+'\');\
   SELECT id FROM food WHERE name = \''+food_name+'\';';
   db.mysql_db.query(insertFoodQuery, (err, rows) =>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     if (food_ingredient[0] === undefined) {
       return security.responseMessage(res, 200, "Successfully posted new Food.");
     }
     var food_id = rows[1][0].id;
     var lastIndex = (food_ingredient.length-1);
     for (var i = 0; i < food_ingredient.length; i++) {

       let insertComboFoodQuery = 'INSERT INTO food_ingredient (ingredient_id, food_id)\
       VALUES('+food_ingredient[i].ingredient_id+','+food_id+');\
       SELECT ingredient_id FROM food_ingredient WHERE ingredient_id ='+food_ingredient[i].ingredient_id+'\
       AND food_id ='+food_id+';';

       db.mysql_db.query(insertComboFoodQuery, (err, rows2)=>{
         if (err) {
           return security.responseMessage(res, 500, err);
         }
         if (rows2[1][0].ingredient_id == food_ingredient[lastIndex].ingredient_id) {
             return security.responseMessage(res, 200, "Successfully posted new Food.");
         }
       });
     }
   });
}
exports.getFoods = function(args, res, next) {
  /**
   * Returns a food Array. Only for Admin
   *
   * size Integer Size of array to receive (optional)
   * offset Integer Start index of the source (optional)
   * returns List
   **/
   let getFoodsQuery = 'SELECT * FROM food';

   db.mysql_db.query(getFoodsQuery, (err, rows) => {
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     if (rows[0] === undefined) {
       return security.responseMessage(res, 404, "No data found on the Database");
     }
     var lastIndex = (rows.length-1);
     for (var i = 0; i < rows.length; i++) {

       let FoodIngredientQuery = 'SELECT * FROM food_ingredient WHERE food_id = '+rows[i].id+';';

       db.mysql_db.query(FoodIngredientQuery, (err, rows2)=>{
        if (err) {
          return security.responseMessage(res, 500, err);
        }

        if (rows2[0] === undefined) {
          return;
        }

        for (var p = 0; p < rows.length; p++) {
          if (rows[p].id == rows2[0].food_id) {
            rows[p].food_ingredient = rows2;
            for (var i = 0; i < rows2.length; i++) {
              rows[p].food_ingredient[i] = {ingredient_id: rows2[i].ingredient_id};
            }
          }
          if (rows[lastIndex].food_ingredient != undefined) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(rows));
          }
        }
       });
     }
   });
}
exports.getCombos = function(args, res, next) {
  /**
   * Returns a combo Array. Only for Admin
   *
   * size Integer Size of array to receive (optional)
   * offset Integer Start index of the source (optional)
   * returns List
   **/
   let getCombosQuery = 'SELECT id, name, price, combo_available, photo FROM combo;';

   db.mysql_db.query(getCombosQuery, (err, rows) => {
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     if (rows[0] === undefined) {
       return security.responseMessage(res, 404, "No data found on the Database");
     }
     var lastIndex = (rows.length-1);
     for (var i = 0; i < rows.length; i++) {
       rows[i].photo = new Buffer(rows[i].photo).toString('base64');
       let ComboFoodQuery = 'SELECT combo_id, food_id FROM food_combo WHERE combo_id = '+rows[i].id+';';
       db.mysql_db.query(ComboFoodQuery, (err, rows2)=>{
        if (err) {
          return security.responseMessage(res, 500, err);
        }
        if (rows2[0] === undefined) {
          return;
        }
        for (var p = 0; p < rows.length; p++) {
          if (rows[p].id == rows2[0].combo_id) {
            rows[p].combo_food = rows2;
            for (var i = 0; i < rows2.length; i++) {
              rows[p].combo_food[i] = {food_id: rows2[i].food_id};
            }
          }
          if (rows[lastIndex].combo_food != undefined) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(rows));
          }
        }
       });
     }
   });
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
  var combo_food = args.combo.value.combo_food;

  let insertComboQuery = 'INSERT INTO combo (name, price, combo_available, photo) \
  VALUES(\''+combo_name+'\','+combo_price+','+combo_available+',\''+combo_photo+'\');\
  SELECT id FROM combo WHERE name = \''+combo_name+'\';';
  db.mysql_db.query(insertComboQuery, (err, rows) =>{
    if (err) {
      return security.responseMessage(res, 500, err);
    }
    if (combo_food[0] === undefined) {
      return security.responseMessage(res, 200, "Successfully posted new Combo.");
    }
    var combo_id = rows[1][0].id;
    var lastIndex = (combo_food.length-1);
    for (var i = 0; i < combo_food.length; i++) {

      let insertComboFoodQuery = 'INSERT INTO food_combo (food_id, combo_id)\
      VALUES('+combo_food[i].food_id+','+combo_id+');\
      SELECT food_id FROM food_combo WHERE food_id ='+combo_food[i].food_id+'\
      AND combo_id ='+combo_id+';';

      db.mysql_db.query(insertComboFoodQuery, (err, rows2)=>{
        if (err) {
          return security.responseMessage(res, 500, err);
        }
        if (rows2[1][0].food_id == combo_food[lastIndex].food_id) {
            return security.responseMessage(res, 200, "Successfully posted new Combo.");
        }
      });
    }
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
  var combo_food = args.combo.value.combo_food;

  let updateComboQuery = 'UPDATE combo SET name = \''+combo_name+'\', price =\
    '+combo_price+', combo_available = '+combo_available+', photo = \
    \''+combo_photo+'\' WHERE id = '+combo_id+'; \
    DELETE FROM food_combo WHERE combo_id ='+combo_id+'; ';
  db.mysql_db.query(updateComboQuery, (err) =>{
     if(err){
       return security.responseMessage(res, 500, err);
     }
     if (combo_food[0] === undefined) {
       return security.responseMessage(res, 200, "Successfully posted new Combo.");
     }

     var lastIndex = (combo_food.length-1);
     for (var i = 0; i < combo_food.length; i++) {

       let insertComboFoodQuery = 'INSERT INTO food_combo (food_id, combo_id)\
       VALUES('+combo_food[i].food_id+','+combo_id+');\
       SELECT food_id FROM food_combo WHERE food_id ='+combo_food[i].food_id+'\
       AND combo_id ='+combo_id+';';

       db.mysql_db.query(insertComboFoodQuery, (err, rows2)=>{
         if (err) {
           return security.responseMessage(res, 500, err);
         }
         if (rows2[1][0].food_id == combo_food[lastIndex].food_id) {
           return security.responseMessage(res, 200, "Successfully updated Combo with the id:"+combo_id+".");
         }
       });
     }
  });
}
