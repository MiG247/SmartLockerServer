'use strict';

const fs = require('fs');

exports.getHtml = function (req, res, next) {
  /**
   * Returns the landing page.
   *
   * no response value expected for this operation
   **/
   fs.readFile('web/index.html', 'utf8', (err, data) => {
     if (err) {
       return res.error({
         status: 500,
         message: 'File System Error',
         err: err
       });
     }
     // Replace Link Placeholder with rest of the url
     // this makes it possible to mantain querys
     data = data.replace(/{{link}}/g, req.url);
     res.statusCode = 200;
     res.end(data);
   });
}
