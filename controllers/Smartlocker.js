'use strict';

var url = require('url');

var Smartlocker = require('./SmartlockerService');


module.exports.getHtml = function getHtml (req, res, next) {
  Smartlocker.getHtml(req.swagger.params, res, next);
};
