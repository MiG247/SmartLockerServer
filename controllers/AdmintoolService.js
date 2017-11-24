'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');
const foodFunctions = require('../Admintool/foodFunctions');
const comboFunctions = require('../Admintool/comboFunctions');
const roleFunctions = require('../Admintool/roleFunctions');
const ingredientFunctions = require('../Admintool/ingredientFunctions');
const scheduleFunctions = require('../Admintool/scheduleFunctions');
const lockerFunctions = require('../Admintool/lockerFunctions');
const orderFunctions = require('../Admintool/orderFunctions');
const adminRole = "Admin";

exports.adminRole = adminRole;

exports.deleteOrder = function deleteOrder (req, res, next) {
  orderFunctions.deleteOrder(req, res, next);
};

exports.update_Order = function update_Order (req, res, next) {
  orderFunctions.update_Order(req, res, next);
};

exports.addLocker = function addLocker (req, res, next) {
  lockerFunctions.addLocker(req, res, next);
};

exports.deleteLocker = function deleteLocker (req, res, next) {
  lockerFunctions.deleteLocker(req, res, next);
};

exports.getLocker = function getLocker (req, res, next) {
  lockerFunctions.getLocker(req, res, next);
};

exports.update_Locker = function update_Locker (req, res, next) {
  lockerFunctions.update_Locker(req, res, next);
};

exports.update_Schedule = function update_Schedule (req, res, next) {
  scheduleFunctions.update_Schedule(req, res, next);
};

exports.deleteSchedule = function deleteSchedule (req, res, next) {
  scheduleFunctions.deleteSchedule(req, res, next);
};

exports.addSchedule = function addSchedule (req, res, next) {
  scheduleFunctions.addSchedule(req, res, next);
};

exports.addIngredient = function addIngredient (req, res, next) {
  ingredientFunctions.addIngredient(req, res, next);
};

exports.deleteIngredient = function deleteIngredient (req, res, next) {
  ingredientFunctions.deleteIngredient(req, res, next);
};

exports.getIngredients = function getIngredients (req, res, next) {
  ingredientFunctions.getIngredients(req, res, next);
};

exports.update_Ingredient = function update_Ingredient (req, res, next) {
  ingredientFunctions.update_Ingredient(req, res, next);
};

exports.getStaff = function getStaff (req, res, next) {
    roleFunctions.getStaff(req, res, next);
};

exports.updatePassword = function updatePassword (req, res, next) {
    roleFunctions.updatePassword(req, res, next);
};

exports.update_Combo = function update_Combo (req, res, next) {
    comboFunctions.update_Combo(req, res, next);
};

exports.addCombo = function addCombo (req, res, next) {
    comboFunctions.addCombo(req, res, next);
};

exports.deleteCombo = function deleteCombo (req, res, next) {
    comboFunctions.deleteCombo(req, res, next);
};

exports.getCombos = function getCombos (req, res, next) {
    comboFunctions.getCombos(req, res, next);
};

exports.addFood = function addFood (req, res, next) {
    foodFunctions.addFood(req, res, next);
};

exports.update_Food = function update_Food (req, res, next) {
    foodFunctions.update_Food(req, res, next);
};

exports.deleteFood = function deleteFood (req, res, next) {
    foodFunctions.deleteFood(req, res, next);
};

exports.getFoods = function getFoods (req, res, next) {
    foodFunctions.getFoods(req, res, next);
};
