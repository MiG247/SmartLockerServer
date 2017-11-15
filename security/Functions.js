'use strict';

const db = require('../MySQL');
const jwt = require('../jwt');
const crypt = require('crypto');
const fs = require('fs');
const url = require('url');

exports.decodeName = function (req) {
  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  return jwt.decode(req.headers['token'] || query.token);
}

exports.auth = function (req, res, userName, cb) {
  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  jwt.verify(req.headers['token'] || query.token, (err, token) => {
    if (err) {
      return res.end(JSON.stringify({
        status: 403,
        massage: err
      }));
    }
    if (!token.userName) {
      return res.end(JSON.stringify({
        status: 403,
        massage: "No UserName in Token!"
      }));
    }
    if (token.userName !== userName) {
      return res.end(JSON.stringify({
        status: 403,
        massage: "User: "+token.userName+" is not authorized!"
      }));
    }
    cb(token);
  });
}

exports.getSalt = function(user){
  /*
    Return the stored Salt from the server.
  */

  var saltData = fs.readFileSync('./security/salt.txt');

  if (saltData === undefined) {
    console.error("Error reading salt.txt.");
    return;
  }
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

  var buf = new Buffer(8192);
  fs.open('./security/salt.txt', 'r+', function (err, fd) {
      if (err) {
        return console.error(err);
      }
      fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
        if (err) {
          console.log(err);
        }
        if (bytes > 0) {
          var file = buf.slice(0, bytes).toString();
          var re = new RegExp(who);
          var matches = file.match(re);
          if (matches) {
            console.log("Entry for "+who+" exists allready! Delete entry and retry again");
            fs.close(fd, function(err) {
              if (err) {
                console.log(err);
              }
            });
            return cb(true);
          }else {
            fs.appendFile('./security/salt.txt', who+": "+salt+"\n", function(err) {
                if (err) {
                  return console.error(err);
                }
            });
            fs.close(fd, function(err) {
              if (err) {
                console.log(err);
              }
            });
            return cb(false);
          }
        }else{
            fs.appendFile('./security/salt.txt', who+": "+salt+"\n", function(err) {
                if (err) {
                  return console.error(err);
                }
            });
            fs.close(fd, function(err) {
                if (err) {
                  console.log(err);
                }
            });
           return cb(false);
        }
      });
  });
};

function saveSaltedHashedPassword(user, userpassword) {
  /*
    Set a new Password for a Staff user
    Password will be safed into the Database Hashed and Salted
    Unhashed Salt will be saved into the Server Filesystem
    under ./security/salt.txt
  */

    var salt = genRandomString(16);
    SaveSaltFile(salt, user, function(response) {
      if (response) {
        console.log("Follow the instructions above.");
      }else {
        var passwordData = sha512(userpassword, salt);

        let updatePass = 'UPDATE staff SET password = \''+passwordData.passwordHash+'\'\
        WHERE name = \''+user+'\';';

        db.mysql_db.query(updatePass, (err) =>{
          if (err) {
           return console.error(err);
          }
          console.log("New Passsword setted.");
        });
      }
    });
}
