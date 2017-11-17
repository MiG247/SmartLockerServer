'use strict';

const Admintool = require('./AdmintoolService');
const url = require('url');
const jwt = require('../jwt');
const security  = require('../security/Functions');

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
