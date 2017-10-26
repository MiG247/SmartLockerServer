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
/*
module.exports.setOrder = function setOrder (req, res, next) {
  Smartlocker.setOrder(req.swagger.params, res, next);
};
*//
module.exports.getComboFood = function getComboFood (req, res, next) {
  Smartlocker.getComboFood(req.swagger.params, res, next);
};
