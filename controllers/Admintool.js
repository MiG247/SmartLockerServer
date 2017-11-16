'use strict';

const Admintool = require('./AdmintoolService');
const url = require('url');
const jwt = require('../jwt');
const security  = require('../security/Functions');

module.exports.getStaff = function getStaff (req, res, next) {
  security.auth(req, res, "noneed", () =>{
    Admintool.getStaff(req.swagger.params, res, next);
  });
};
