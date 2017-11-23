'use strict';

const Admintool = require('./AdmintoolService');
const url = require('url');
const jwt = require('../jwt');
const security  = require('../security/Functions');


module.exports.update_Schedule = function update_Schedule (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.update_Schedule(req.swagger.params, res, next);
  });
};

module.exports.deleteSchedule = function deleteSchedule (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.deleteSchedule(req.swagger.params, res, next);
  });
};

module.exports.addSchedule = function addSchedule (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.addSchedule(req.swagger.params, res, next);
  });
};

module.exports.addIngredient = function addIngredient (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.addIngredient(req.swagger.params, res, next);
  });
};

module.exports.deleteIngredient = function deleteIngredient (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.deleteIngredient(req.swagger.params, res, next);
  });
};

module.exports.getIngredients = function getIngredients (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.getIngredients(req.swagger.params, res, next);
  });
};

module.exports.update_Ingredient = function update_Ingredient (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.update_Ingredient(req.swagger.params, res, next);
  });
};

module.exports.getStaff = function getStaff (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.getStaff(req.swagger.params, res, next);
  });
};

module.exports.updatePassword = function updatePassword (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.updatePassword(req.swagger.params, res, next);
  });
};

module.exports.update_Combo = function update_Combo (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.update_Combo(req.swagger.params, res, next);
  });
};

module.exports.addCombo = function addCombo (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.addCombo(req.swagger.params, res, next);
  });
};

module.exports.deleteCombo = function deleteCombo (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.deleteCombo(req.swagger.params, res, next);
  });
};

module.exports.getCombos = function getCombos (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.getCombos(req.swagger.params, res, next);
  });
};

module.exports.getFoods = function getFoods (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.getFoods(req.swagger.params, res, next);
  });
};

module.exports.addFood = function addFood (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.addFood(req.swagger.params, res, next);
  });
};

module.exports.update_Food = function update_Food (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.update_Food(req.swagger.params, res, next);
  });
};

module.exports.deleteFood = function deleteFood (req, res, next) {
  security.auth(req, res, Admintool.adminRole, () =>{
    Admintool.deleteFood(req.swagger.params, res, next);
  });
};
