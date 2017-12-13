'use strict';

const url = require('url');
const jwt = require('../jwt');
const Smartlocker = require('./SmartlockerService');
const security  = require('../security/Functions');

module.exports.cancelOrder = function cancelOrder(req, res, next) {
  security.auth(req, res, req.swagger.params.orderID.value, () =>{
    Smartlocker.cancelOrder(req.swagger.params, res, next);
  });
}

module.exports.verifyPIN = function verifyPIN (req, res, next) {
  security.auth(req, res, "Locker", () =>{
    Smartlocker.verifyPIN(req.swagger.params, res, next);
  });
};

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
  var userName = security.decodeName(req, res).userName; //userName stored in token
  if (userName === "Clerk" || userName === "Admin") {
    security.auth(req, res, "Clerk", () =>{
      Smartlocker.getOrder(req.swagger.params, res, next);
    });
  }else {
    security.auth(req, res, req.swagger.params.orderID.value, () =>{
      Smartlocker.getOrder(req.swagger.params, res, next);
    });
  }

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
  security.auth(req, res, "Clerk", () =>{
    Smartlocker.getOrderArray(req.swagger.params, res, next);
  });
};

module.exports.updateCombo = function updateCombo (req, res, next) {
  security.auth(req, res, "Clerk", () =>{
    Smartlocker.updateCombo(req.swagger.params, res, next);
  });
};

module.exports.updateOrder = function updateOrder (req, res, next) {
  security.auth(req, res, "Clerk", () =>{
    Smartlocker.updateOrder(req.swagger.params, res, next);
  });
};

module.exports.getLockerArray = function getLockerArray (req, res, next) {
  security.auth(req, res, "Locker", () =>{
    Smartlocker.getLockerArray(req.swagger.params, res, next);
  });
};
