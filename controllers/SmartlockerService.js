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
   var find = '%3A';
   var re = new RegExp(find);
   var pickupTime = escape(args.pickupTime.value);
   var comboID = escape(args.comboID.value);
   pickupTime = pickupTime.replace(re, ':');

   let availableQuery = 'SELECT available FROM schedule WHERE pickup_time =\''
   +pickupTime+'\'';

   db.mysql_db.query(availableQuery, (err, rows) =>{
     if(err){
       return res.end(JSON.stringify({
         status: 500,
         message: err}));
     }
     if(rows[0].available == 0){
       return res.end(JSON.stringify({
         status: 406,
         message: "Order Not Accepted. Time is not available."
       }));
     }else {
       // check for available locker
       let getAvailableLockerQuery = 'SELECT nr FROM locker WHERE NOT nr IN \
       (SELECT locker_nr FROM locker_schedule WHERE pickup_time= \''+pickupTime+'\')';
       db.mysql_db.query(getAvailableLockerQuery, (err, rows) =>{
         if(err){
           return res.end(JSON.stringify({
             status: 500,
             message: err
           }));
         }
         let insertOrderQuery = '';

         if(rows.length == 1){
           insertOrderQuery = 'UPDATE schedule SET available = 0 WHERE pickup_time = \
           \''+pickupTime+'\';';
         }
         // insert Order function
         var lockerNR = rows[0].nr;
         var uuid = uuidv4();
         insertOrderQuery = insertOrderQuery+' INSERT INTO orders(id, combo_id) \
         VALUES(\''+uuid+'\','+comboID+'); \
         INSERT INTO locker_schedule(pickup_time, locker_nr, orders_id) \
         VALUES(\''+pickupTime+'\','+lockerNR+',\''+uuid+'\');'

        res.setHeader('Content-Type', 'application/json');

          db.mysql_db.query(insertOrderQuery, (err, rows) => {
             if (err) {
               return res.end(JSON.stringify({
                 status: 500,
                 message: err}));
             }
               res.statusCode = 200;
               res.end(JSON.stringify({
                 pickup_time: pickupTime,
                 locker_nr: lockerNR,
                 orders_id: uuid
               }));
             });
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
   let query = 'SELECT distinct id, combo_id, ordered_at, pickup_time, locker_nr, pin FROM orders, locker_schedule, locker\
   WHERE id = \''+escape(args.orderID.value)+'\' AND orders_id = \''+escape(args.orderID.value)+'\'\
   AND nr = locker_nr';

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

exports.getComboIngredient = function(args, res, next) {
    /**
     * Gets the basic information from the ingredients
     *
     * combo_id Integer the combo identifier number
     * returns List
     **/
    let query = 'SELECT name FROM ingredient WHERE id IN(\
SELECT ingredient_id FROM food_ingredient WHERE food_id IN(\
SELECT food_id FROM food_combo WHERE combo_id ='+escape(args.combo_id.value)+'))';

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
