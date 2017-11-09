'use strict';

var url = require('url');

var Smartlocker = require('./SmartlockerService');


module.exports.getHtml = function getHtml (req, res, next) {
  Smartlocker.getHtml(req.swagger.params, res, next);
};

module.exports.getComboArray = function getComboArray (req, res, next) {
  Smartlocker.getComboArray(req.swagger.params, res, next);
};

module.exports.getTimeSchedule = function getTimeSchedule (req, res, next) {
  Smartlocker.getTimeSchedule(req.swagger.params, res, next);
};

module.exports.getOrder = function getOrder (req, res, next) {
  Smartlocker.getOrder(req.swagger.params, res, next);
};

module.exports.setOrder = function setOrder (req, res, next) {
  Smartlocker.setOrder(req.swagger.params, res, next);
};

module.exports.getComboFood = function getComboFood (req, res, next) {
  Smartlocker.getComboFood(req.swagger.params, res, next);
};

module.exports.getComboIngredient = function getComboIngredient (req, res, next) {
  Smartlocker.getComboIngredient(req.swagger.params, res, next);
};

module.exports.getOrderArray = function getOrderArray (req, res, next) {
  Smartlocker.getOrderArray(req.swagger.params, res, next);
};

module.exports.updateCombo = function updateCombo (req, res, next) {
  Smartlocker.updateCombo(req.swagger.params, res, next);
};

module.exports.updateOrder = function updateOrder (req, res, next) {
  Smartlocker.updateOrder(req.swagger.params, res, next);
};

module.exports.getLockerArray = function getLockerArray (req, res, next) {
  Smartlocker.getLockerArray(req.swagger.params, res, next);
};
