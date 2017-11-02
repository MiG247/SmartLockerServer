'use strict';

const fs = require('fs');
const db = require('../MySQL');
const uuidv4 = require('uuid/v4');

exports.updatedOrder = function(args, res, next) {
  /**
   * Sets an order to served
   *
   * order_id String The order identifier string
   * combo_id Integer The combo identifier number
   * pickup_time String The time from schedule
   * locker_nr Integer The locker identifier number
   * no response value expected for this operation
   **/
   // seq is a PIN generator
  var seq = parseInt(Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var find = '%3A';
  var re = new RegExp(find);
  var combo_id = escape(args.combo_id.value);
  var pickup_time = escape(args.pickup_time.value);
  var locker_nr = escape(args.locker_nr.value);
  pickup_time = pickup_time.replace(re, ':');

  let getOrder = 'SELECT id FROM orders WHERE id = \
    (SELECT orders_id FROM locker_schedule, orders \
      WHERE pickup_time = \''+pickup_time+'\' AND locker_nr = '+locker_nr+'\
      AND combo_id = '+combo_id+');'

  db.mysql_db.query(getOrder, (err, rows) =>{
    if(err){
      return res.end(JSON.stringify({
        status: 500,
        massage: err
      }));
    }
    let updateOrder = 'UPDATE orders SET served = 1 WHERE id = \''+rows[0].id+'\';';
    db.mysql_db.query(updateOrder, (err) =>{
      if(err){
        return res.end(JSON.stringify({
          status: 500,
          massage: err
        }));
      }

      let updateLocker = 'UPDATE locker SET PIN = '+seq+' WHERE nr = '+locker_nr
      db.mysql_db.query(updateLocker, (err) =>{
        if(err){
          return res.end(JSON.stringify({
            status: 500,
            massage: err
          }));
        }
        res.end(JSON.stringify({
          status: 200,
          message: "Order for "+pickup_time+" with combo "+combo_id+" into locker "+locker_nr+" has been served."
        }));
      });
    });
  });
}

exports.updateCombo = function(args, res, next){
  /*
  * Updates a Combo availablity
  * and returns the Updated Combo Object
  */
  var id = escape(args.combo_id.value);
  var name = escape(args.combo_name.value);
  var price = escape(args.combo_price.value);
  let getCombo = 'SELECT id, name, price, combo_available FROM combo WHERE\
                  id ='+id+' AND name = \''+name+'\' AND price = '+price;

  db.mysql_db.query(getCombo, (err, rows) =>{
    if(err){
      return res.end(JSON.stringify({
          status: 500,
          massage: err
      }));
    }
    let updateCombo = 'UPDATE combo SET combo_available = 0 WHERE id = '+id;

    db.mysql_db.query(updateCombo, (err) =>{
      if(err){
        return res.end(JSON.stringify({
          status: 500,
          massage: err
        }));
      }
        rows[0].combo_available = 0;
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(rows));
      });
    });
  }

exports.getOrderArray = function(args, res, next) {
  /**
   * Gets an array of 'orders' objects
   * returns List
   **/
   let getOrderArrayQuery = 'select orders.combo_id, combo.name, locker_schedule.locker_nr, locker_schedule.pickup_time, orders.served\
    from orders inner join combo on orders.combo_id = combo.id \
    inner join locker_schedule on orders.id = locker_schedule.orders_id';

   db.mysql_db.query(getOrderArrayQuery, (err, rows) =>{
     if (err) {
      return res.end(JSON.stringify({
         status: 500,
         message: err
       }));
     }
     res.setHeader('Content-Type', 'application/json');
     res.statusCode = 200;
     res.end(JSON.stringify(rows));
   });
}

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

   let availableQuery = 'select schedule_available, combo_available from schedule, combo\
    WHERE pickup_time = \''+pickupTime+'\' AND combo.id = '+comboID;

   db.mysql_db.query(availableQuery, (err, rows) =>{
     if(err){
       return res.end(JSON.stringify({
         status: 500,
         message: err}));
     }
     if(rows[0].schedule_available == 0){
       return res.end(JSON.stringify({
         status: 406,
         message: "Order Not Accepted. Time is not available."
       }));
     }else if (rows[0].combo_available == 0){
       return res.end(JSON.stringify({
         status: 406,
         message: "Order Not Accepted. Combo is not available."
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
           insertOrderQuery = 'UPDATE schedule SET schedule_available = 0 WHERE pickup_time = \
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
     FROM food_combo WHERE combo_id ='+escape(args.comboID.value)+')';

   res.setHeader('Content-Type', 'application/json');

   db.mysql_db.query(query, (err, rows) => {
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
   let query = 'SELECT distinct id, combo_id, ordered_at, pickup_time, served, locker_nr, pin FROM orders, locker_schedule, locker\
   WHERE id = \''+escape(args.orderID.value)+'\' AND orders_id = \''+escape(args.orderID.value)+'\'\
   AND nr = locker_nr';

   res.setHeader('Content-Type', 'application/json');

   db.mysql_db.query(query, (err, rows) => {
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
SELECT food_id FROM food_combo WHERE combo_id ='+escape(args.comboID.value)+'))';

    res.setHeader('Content-Type', 'application/json');

    db.mysql_db.query(query, (err, rows) => {
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
   let query = 'SELECT id, name, price, combo_available FROM combo';

   res.setHeader('Content-Type', 'application/json');

   db.mysql_db.query(query, (err, rows) => {
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

  db.mysql_db.query(query, (err, rows) => {
    if (err) {
      return res.end(JSON.stringify({
        status: 500,
        message: err}));
    }
      res.statusCode = 200;
      res.end(JSON.stringify(rows));
    });
}
