'use strict';

const fs = require('fs');
const db = require('../MySQL');
const uuidv4 = require('uuid/v4');


//exports.setOrder = function(args, res, next) {
  /**
   * Requests an order and gets a orderID back if successed
   *
   * comboID Integer The combo identifier number
   * pickupTime Date The time from schedule
   * returns Order/properties/id
   **/
/*
   let availableQuery = 'SELECT available FROM schedule WHERE pickup_time ='
   +escape(args.pickupTime.value);

   db.mysql_db.query(availableQuery, (err, rows) =>{
     if(err){
       return res.end(JSON.stringify({
         status: 500,
         message: err}));
     }
     if(rows[0].available == 1){
       return res.end(JSON.stringify({
         status: 406,
         message: "Order Not Accepted. Time is not available."
       }));
     }
     let query = 'INSERT orders'
   });
*/
/*
  if( db.mysql_db.query(availableQuery, (err, rows, fields) =>{
     if(err){
       console.error("failed");
       return true;
     }
     if(rows[0].available == 1){
  //      availableVar = false;
        console.log("rows.value == 1");
        return false;
     }else {
       console.log("rows.value != 1");
       return true;
     }
   }).value == true){
     console.log("rows.vlaue !=1");
   }else {
     console.log("rows.value == 1, you can proccess");
   }
*/
/*
   let query = 'SELECT id, combo_id, ordered_at FROM orders WHERE id='
   +escape(args.orderID.value);

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
*/
//}


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
   let query = 'SELECT id, combo_id, ordered_at FROM orders WHERE id='+escape(args.orderID.value);

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
