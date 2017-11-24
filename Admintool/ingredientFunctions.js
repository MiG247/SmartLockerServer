'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');


exports.addIngredient = function(args, res, next) {
  /**
   * Post a new Ingredient entry. Only for Admin
   *
   * food AdmintoolIngredient Information to add a new Ingredient.
   * no response value expected for this operation
   **/
   var ingredient_name = args.ingredient.value.ingredient_name;

   let insertIngredientQuery = 'INSERT INTO ingredient (name) \
   VALUES(\''+ingredient_name+'\');';
   db.mysql_db.query(insertIngredientQuery, (err, rows) =>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     return security.responseMessage(res, 200, "Successfully posted new Ingredient.");
   });
}

exports.update_Ingredient = function(args, res, next) {
  /**
   * Update a Ingredient entry. Old IngredientID is necessary. Only for Admin
   *
   * food AdmintoolIngredientInformation to update Food.
   * no response value expected for this operation
   **/
   var ingredient_id = escape(args.ingredient.value.ingredient_id);
   var ingredient_name = args.ingredient.value.ingredient_name;

   let updateIngredientQuery = 'UPDATE ingredient SET name = \''+ingredient_name+'\'\
     WHERE id = '+ingredient_id+';';
   db.mysql_db.query(updateIngredientQuery, (err) =>{
      if(err){
        return security.responseMessage(res, 500, err);
      }
      return security.responseMessage(res, 200, "Successfully updated a Ingredient entry.");
   });
}

exports.deleteIngredient = function(args, res, next) {
  /**
   * Delete a Ingrediententry. IngredientID is necessary. Only for Admin
   *
   * food Ingredient Information to add a new Ingredient.
   * no response value expected for this operation
   **/
   var ingredient_id = escape(args.ingredient.value.ingredient_id);
   let deleteIngredientQuery =  'DELETE FROM food_ingredient WHERE ingredient_id = '+ingredient_id+'; \
    DELETE FROM ingredient WHERE id = '+ingredient_id+';';

   db.mysql_db.query(deleteIngredientQuery, (err)=>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     return security.responseMessage(res, 200, "Successfully deleted ingredient with the id:"+ingredient_id+".");
   });
}

exports.getIngredients = function(args, res, next) {
  /**
   * Returns a Ingredient Array. Only for Admin
   *
   * size Integer Size of array to receive (optional)
   * offset Integer Start index of the source (optional)
   * returns List
   **/
   let getIngredientsQuery = 'SELECT * FROM ingredient';

   db.mysql_db.query(getIngredientsQuery, (err, rows) => {
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
