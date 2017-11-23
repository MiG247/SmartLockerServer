'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');

exports.update_Combo = function(args, res, next) {
  /**
   * Update a Combo entry. Only for Admin
   *
   * combo Combo Information to update Combo.
   * no response value expected for this operation
   **/
  var combo_id = escape(args.combo.value.combo_id);
  var combo_name = args.combo.value.combo_name;
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
       return security.responseMessage(res, 200, "Successfully posted updated a Combo.");
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

exports.addCombo = function(args, res, next) {
  /**
   * Post a new Combo entry. Only for Admin
   *
   * combo Combo Information to add a new Combo.
   * no response value expected for this operation
   **/
  var combo_name = args.combo.value.combo_name;
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
