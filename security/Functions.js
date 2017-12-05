'use strict';

const db = require('../MySQL');
const jwt = require('../jwt');
const crypt = require('crypto');
const fs = require('fs');
const url = require('url');
const security  = require('../security/Functions');
const securityFile = './security/salt.txt';

exports.responseMessage = function (res, statusCode, massageData) {
  return res.end(JSON.stringify({
    status: statusCode,
    massage: massageData
  }));
}

exports.decodeName = function (req, res) {
  /*
    Decodes the RequestValues of Token
    from header or query
  */

  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;

  if ((req.headers['token'] || query.token) != undefined) {
    return jwt.decode(req.headers['token'] || query.token);
  }
  if ((req.headers['api_key'] || query.api_key) != undefined) {
    return jwt.decode(req.headers['api_key'] || query.api_key);
  }
  return security.responseMessage(res, 403, "Missing Token!");
}

exports.auth = function (req, res, userName, cb) {
  /*
    Authentication procedure
    Returns as CallBack the token
  */
  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;

  if ((req.headers['token'] || query.token) != undefined) {
    jwt.verify(req.headers['token'] || query.token, (err, token) => {
      if (err) {
        return security.responseMessage(res, 403, err);
      }
      if (!token.userName) {
        return security.responseMessage(res, 403, "No UserName in Token!");
      }
      if(token.admin == 1){
        return cb(token);
      }
      if (token.userName !== userName) {
        return security.responseMessage(res, 403, "User: "+token.userName+" is not authorized!");
      }
      cb(token);
    });
  }
  if ((req.headers['api_key'] || query.api_key) != undefined) {
    jwt.verify(req.headers['api_key'] || query.api_key, (err, token) => {
      if (err) {
        return security.responseMessage(res, 403, err);
      }
      if (!token.userName) {
        return security.responseMessage(res, 403, "No UserName in Token!");
      }
      if(token.admin == 1){
        return cb(token);
      }
      if (token.userName !== userName) {
        return security.responseMessage(res, 403, "User: "+token.userName+" is not authorized!");
      }
      cb(token);
    });
  }

}

exports.getSalt = function(user){
  /*
    Return the stored Salt from the server.
    As a object with user: and salt:
  */

  var saltData = fs.readFileSync(securityFile);

  if (saltData === undefined) {
    console.error("Error reading salt.txt.");
    return;
  }
  // algorithm to seperate the data in lines.
  saltData = saltData.toString().split("\n");
  var re = new RegExp(user);
  var userSalt = "";
  for (var i = 0; i < saltData.length; i++) {
    if(re.test(saltData[i])){
      userSalt = saltData[i].split(": ");
    }
  }
  return {
      user: userSalt[0],
      salt: userSalt[1]
  };
}


var genRandomString = function(length){
  /**
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */

    return crypt.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};


exports.sha512 = function(password, salt){
  /**
   * hash password with sha512.
   * @function
   * @param {string} password - List of required fields.
   * @param {string} salt - Data to be validated.
   * @return {Object}
   */

    var hash = crypt.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};


function SaveSaltFile(salt, who, cb) {
  /*
   function to store Salt into the server file ./security/salt.txt

   Checks the file for allready existing entrys.
   If entrys for the User exists you have to delete it from the file manuelly
   */
  const newEntry = who+": "+salt+"\n";
  var buf = new Buffer(8192);
  fs.open(securityFile, 'r+', function (err, fd) {
      if (err) {
        return cb(err);
      }
      fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
        if (err) {
          return cb(err);
        }

          var file = buf.slice(0, bytes).toString();
          var re = new RegExp(who);
          var matches = file.match(re);
          var indexOfDeletedEntry;
          if (matches != null) {
            // Entry for "who" exists allready! Delete entry and retry again
            file = file.split("\n");
            for (var i = 0; i < file.length; i++) {
              if (file[i].match(re)) {
                  delete file[i];
                  indexOfDeletedEntry = i;
              }
            }
            fs.writeFileSync(securityFile, "");

            for (var i = 0; i < file.length; i++) {
              if (i != indexOfDeletedEntry) {
                if (file[i]!= '') {
                  fs.appendFile(securityFile, file[i]+"\n", function(err) {
                      if (err) {
                        return cb(err);
                      }
                  });
                }
              }
            }
            fs.appendFile(securityFile, newEntry, function(err) {
                if (err) {
                  return cb(err);
                }
            });
            fs.close(fd, function(err) {
              if (err) {
                return cb(err);
              }
            });
            return cb();
          } //if(matches != null) end
            fs.appendFile(securityFile, newEntry, function(err) {
                if (err) {
                  return cb(err);
                }
            });
            fs.close(fd, function(err) {
                if (err) {
                  return cb(err);
                }
            });
           return cb();
      });
  });
};

exports.saveSaltedHashedPassword = function(user, userpassword, res) {
  /*
    Set a new Password for a Staff user
    Password will be safed into the Database Hashed and Salted
    Unhashed Salt will be saved into the Server Filesystem
    under ./security/salt.txt
  */
    var salt = genRandomString(16);
    SaveSaltFile(salt, user, function(err) {
      if (err) {
        return security.responseMessage(res, 500, err);
      }else {
        var passwordData = security.sha512(userpassword, salt);

        let updatePass = 'UPDATE staff SET password = \''+passwordData.passwordHash+'\'\
        WHERE name = \''+user+'\';';

        db.mysql_db.query(updatePass, (err) =>{
          if (err) {
            return security.responseMessage(res, 500, err);
          }
          return security.responseMessage(res, 200, "New password setted.");
        });
      }
    });
}
