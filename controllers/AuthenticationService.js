'use strict';

const db = require('../MySQL');
const jwt = require('../jwt');
const crypt = require('crypto');
const fs = require('fs');
const security  = require('../security/Functions');

exports.getToken = function(args, res, next){
  /**
   * Login to the Server and get a JSON WEB Token back.
   *
   * login Staff Login informations
   * no response value expected for this operation
   **/

  var username = escape(args.login.value.name);
  var password = escape(args.login.value.password);
  //confirm the hashed password
  var userSalt = security.getSalt(username);
  //check for valid data
  if (userSalt.salt === undefined) {
    return res.end(JSON.stringify({
      status: 406,
      message: "Permission denied. Username or Password ar invalied."
    }));
  }

  password = security.sha512(password, userSalt.salt);
  password = password.passwordHash;

  let getUser = 'SELECT name, password, admin FROM staff WHERE name = \''+username+'\
                  \' AND password = \''+password+'\'';

  //res.setHeader('Content-Type', 'application/json');

  db.mysql_db.query(getUser, (err, rows) => {
    if (err) {
      return res.end(JSON.stringify({
        status: 500,
        message: err}));
    }
    if (rows[0] === undefined) {
      return res.end(JSON.stringify({
        status: 406,
        message: "Permission denied. Username or Password ar invalied."
      }));
    }
    const payload = {
      exp: 144000,
      userName: username,
      admin: rows[0].admin
    };

    jwt.sign(payload, (err, token) =>{
        if (err) {
          return res.end(JSON.stringify({
            status: 403,
            message: err
          }));
        }
        res.statusCode = 200;
        res.end(JSON.stringify({
          name: rows[0].name,
          token: token
        }));
      });
  });
}
