'use strict';

const fs = require('fs');
const db = require('../MySQL');
const uuidv4 = require('uuid/v4');


exports.setOrder = function(args, res, next) {
  /**
   * Requests an order and gets a orderID back if successed
   *
   * comboID Integer The combo identifier number
   * pickupTime Date The time from schedule
   * returns Order/properties/id
   **/
   var pickupTime =escape(args.pickupTime.value);
   var comboID =escape(args.comboID.value); // decodeURIComponent

   let availableQuery = 'SELECT available FROM schedule WHERE pickup_time =\''
   +pickupTime+'\'';

   db.mysql_db.query(availableQuery, (err, rows) =>{
     if(err){
       return res.end(JSON.stringify({
         status: 500,
         message: err}));
     }
     if(rows.available == 0){
       return res.end(JSON.stringify({
         status: 406,
         message: "Order Not Accepted. Time is not available."
       }));
     }else {

     var uuid = uuidv4();
     let insertOrderQuery = 'UPDATE schedule SET available = 0 WHERE pickup_time = \
     \''+pickupTime+'\';\
     INSERT INTO orders(id, combo_id) \
     VALUES(\''+uuid+'\','+comboID+'); \
     INSERT INTO locker_schedule(pickup_time, locker_nr, orders_id) \
     VALUES(\''+pickupTime+'\',1001,\''+uuid+'\');' //locker_nr has to be adjusted

     db.mysql_db.query(insertOrderQuery, (err, rows, fields) => {
       if (err) {
         return res.end(JSON.stringify({
           status: 500,
           message: err}));
       }
       res.statusCode = 200;
       res.end(JSON.stringify({
         orders_id: uuid
       }));
     });
    }
   });
}


exports.getComboFood = function(args, res, next) {
  /**
   * Gets the basic informations from a combo the food
   *
   * comboID Integer The combo identifier number
   * returns List
   **/
   let query = 'SELECT id, name FROM food WHERE id IN (SELECT food_id \
     FROM food_combo WHERE combo_id ='+escape(args.combo_id.value)+')';

   res.setHeader('Content-Type', 'application/json');

   db.mysql_db.query(query, (err, rows, fields) => {
     if (err) {
       return res.end(JSON.stringify({
         status: 500,
         message: err}));
     }
     res.statusCode = 200;
     res.end(JSON.stringify(rows));
   });
}

exports.getOrder = function(args, res, next) {
  /**
   * Gets the basic informations from an oreder
   *
   * orderID Integer The order identifier number
   * returns Order
   **/
   let query = 'SELECT id, combo_id, ordered_at FROM orders WHERE id = \''
   +escape(args.orderID.value)+'\'';

   res.setHeader('Content-Type', 'application/json');

   db.mysql_db.query(query, (err, rows, fields) => {
     if (err) {
       return res.end(JSON.stringify({
         status: 500,
         message: err}));
     }
     res.statusCode = 200;
     res.end(JSON.stringify(rows));
   });
}

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

exports.getComboArray = function(args, res, next) {
  /**
   * Gets an array of 'user' objects.
   *
   * size Integer Size of array to receive (optional)
   * offset Integer Start index of the source (optional)
   * returns List
   **/
   let query = 'SELECT id, name, price FROM combo';

   res.setHeader('Content-Type', 'application/json');

   db.mysql_db.query(query, (err, rows, fields) => {
     if (err) {
       return res.end(JSON.stringify({
         status: 500,
         message: err}));
     }
     res.statusCode = 200;
     res.end(JSON.stringify(rows));
   });
}


exports.getTimeSchedule = function(args, res, next) {
  /**
   * Gets an array of 'timeschedule' objects.
   *
   * returns List
   **/
  let query = 'SELECT * FROM schedule';

  res.setHeader('Content-Type', 'application/json');

  db.mysql_db.query(query, (err, rows, fields) => {
    if (err) {
      return res.end(JSON.stringify({
        status: 500,
        message: err}));
    }
      res.statusCode = 200;
      res.end(JSON.stringify(rows));
    });
}
