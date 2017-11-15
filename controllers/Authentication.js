'use strict';

var url = require('url');

var Authentication = require('./AuthenticationService');

module.exports.getToken = function getToken (req, res, next) {
  Authentication.getToken(req.swagger.params, res, next);
};
