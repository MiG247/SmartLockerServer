
const jwt = require('jsonwebtoken');

const secret = 'QIe1g0fDwAf7cQp$cx*Is4hfWI@67PRdwcI5CT@hjYD0QjTqQg$e4k28ksbx%0re175E69aeXyxzQbwXjX6soEt3SDxwggX&SChHyMBJ2&0rV6XziHGLWz8CeLctBKRVtz*TTE8Jy6d4S!LgbU*HvcoXgrdsg8H!Ios4h99mUZxHLqSdVchlVk71h0nB&aykXNY!N%SUhTWMKyI@y9AL*8TQYUl@88CMtMv^zw2141QBtYNm#s22l@PD!Nq72CPa';

module.exports.verify = function (token, cb) {
  jwt.verify(token, secret, cb);
};

module.exports.sign = function (payload, cb) {
  jwt.sign(payload, secret, cb);
};
