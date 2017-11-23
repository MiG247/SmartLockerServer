'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');


exports.addFood = function(args, res, next) {
  /**
   * Post a new Food entry. Only for Admin
   *
   * food AdmintoolFood Information to add a new Food.
   * no response value expected for this operation
   **/
   var food_name = args.food.value.food_name;
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

exports.update_Food = function(args, res, next) {
  /**
   * Update a Food entry. Old FoodID is necessary. Only for Admin
   *
   * food AdmintoolFood Information to update Food.
   * no response value expected for this operation
   **/
   var food_id = escape(args.food.value.food_id);
   var food_name = args.food.value.food_name;
   var food_ingredient = args.food.value.food_ingredient;

   let updateFoodQuery = 'UPDATE food SET name = \''+food_name+'\'\
     WHERE id = '+food_id+'; \
     DELETE FROM food_ingredient WHERE food_id ='+food_id+'; ';
   db.mysql_db.query(updateFoodQuery, (err) =>{
      if(err){
        return security.responseMessage(res, 500, err);
      }
      if (food_ingredient[0] === undefined) {
        return security.responseMessage(res, 200, "Successfully updated a Food entry");
      }

      var lastIndex = (food_ingredient.length-1);
      for (var i = 0; i < food_ingredient.length; i++) {

        let insertFoodIngredientQuery = 'INSERT INTO food_ingredient (ingredient_id, food_id)\
        VALUES('+food_ingredient[i].ingredient_id+','+food_id+');\
        SELECT ingredient_id FROM food_ingredient WHERE ingredient_id ='+food_ingredient[i].ingredient_id+'\
        AND food_id ='+food_id+';';

        db.mysql_db.query(insertFoodIngredientQuery, (err, rows2)=>{
          if (err) {
            return security.responseMessage(res, 500, err);
          }
          if (rows2[1][0].ingredient_id == food_ingredient[lastIndex].ingredient_id) {
            return security.responseMessage(res, 200, "Successfully updated Food with the id:"+food_id+".");
          }
        });
      }
   });
}

exports.deleteFood = function(args, res, next) {
  /**
   * Delete a Food entry. FoodID is necessary. Only for Admin
   *
   * food Food Information to add a new Food.
   * no response value expected for this operation
   **/
   var food_id = escape(args.food.value.food_id);
   let deleteFoodQuery =  'DELETE FROM food_ingredient WHERE food_id ='+food_id+'; \
   DELETE FROM food WHERE id = '+food_id+';';

   db.mysql_db.query(deleteFoodQuery, (err)=>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     return security.responseMessage(res, 200, "Successfully deleted food with the id:"+food_id+".");
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
