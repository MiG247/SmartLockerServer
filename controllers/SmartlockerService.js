'use strict';

const fs = require('fs'); //Filesystem
const db = require('../MySQL'); // binding the MySQL.js script
const uuidv4 = require('uuid/v4'); //unique id generator
const security  = require('../security/Functions'); // binding the security functions
const jwt = require('../jwt'); // binding the JSON Web Token script

exports.verifyPIN = function(args, res, next) {
  /**
   * verifies the PIN of a Locker. For LockerApp
   *
   * locker Locker Locker PIN
   * no response value expected for this operation
   **/
   // Arguments escape() function to prevent SQL injection
   var lockerPIN = escape(args.PIN.value.PIN);
   let getLocker = 'SELECT * FROM locker WHERE PIN = '+lockerPIN;
   //Database Request
   db.mysql_db.query(getLocker, (err, rows)=> {
     //Error Handling
     if(err){
       return security.responseMessage(res, 500, err);
     }
     //If Database does not return any Data.
     if(rows[0] === undefined){
       return security.responseMessage(res, 406, "Invalied PIN!");
     }
     // Successfull response returns a JSON file with LockerNr and PIN
     res.setHeader('Content-Type', 'application/json');
     res.statusCode = 200;
     res.end(JSON.stringify(rows[0]));
   });
}


exports.getLockerArray = function(args, res, next) {
  /**
   * Gets an array of 'locker' objects
   *
   * returns List
   **/
   let getLockerArrayQuery = 'SELECT * FROM locker;';
   //Database Request
   db.mysql_db.query(getLockerArrayQuery, (err, rows) =>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     res.setHeader('Content-Type', 'application/json');
     res.statusCode = 200;
     res.end(JSON.stringify(rows));
   });
}

exports.updateOrder = function(args, res, next) {
  /**
   * Sets an order to served
   *
   * order_id String The order identifier string
   * combo_id Integer The combo identifier number
   * pickup_time String The time from schedule
   * locker_nr Integer The locker identifier number
   * no response value expected for this operation
   **/
   // seq is a PIN generator with a four digit Number
  var digitLength = 10000; // four digit
  var seq = parseInt(Math.floor(Math.random() * digitLength) + digitLength).toString().substring(1);
  // RegExp to decode the URI characters from pickup_time
  var find = '%3A';
  var re = new RegExp(find, "g");
  // Requestarguments escape() function to prevent SQL injection
  var combo_id = escape(args.close_order.value.combo_id);
  var pickup_time = escape(args.close_order.value.pickup_time);
  var locker_nr = escape(args.close_order.value.locker_nr);
  //Decoding the URI characters
  pickup_time = pickup_time.replace(re, ':');


  let getOrder = 'SELECT id FROM orders WHERE id = \
    (SELECT DISTINCT orders_id FROM locker_schedule, orders \
      WHERE pickup_time = \''+pickup_time+'\' AND locker_nr = '+locker_nr+'\
      AND combo_id = '+combo_id+');'

  db.mysql_db.query(getOrder, (err, rows) =>{
    if(err){
      return security.responseMessage(res, 500, err);
    }

    if(rows[0] === undefined){
      return security.responseMessage(res, 406, "Order not Accepted. Invalied Data.");
    }
    //Building a LockerNr PIN combo.
    seq = locker_nr + seq;

    let updateOrder = 'UPDATE orders SET served = 1 WHERE id = \''+rows[0].id+'\';\
    UPDATE locker SET PIN = '+seq+' WHERE nr = '+locker_nr+';';

    db.mysql_db.query(updateOrder, (err) =>{
      if(err){
        return security.responseMessage(res, 500, err);
      }

      return security.responseMessage(res, 200, "Order for "+pickup_time+" with combo "+combo_id+" into locker "+locker_nr+" has been served.");

    });
  });
}

exports.updateCombo = function(args, res, next){
  /*
  * Updates a Combo availablity
  * and returns the Updated Combo Object
  */
  // Requestarguments escape() function to prevent SQL injection
  var id = escape(args.combo.value.combo_id);
  var name = escape(args.combo.value.combo_name);
  var price = escape(args.combo.value.combo_price);
  var available = escape(args.combo.value.combo_available);

  let getCombo = 'SELECT id, name, price, combo_available FROM combo WHERE\
                  id ='+id+' AND name = \''+name+'\' AND price = '+price;

  db.mysql_db.query(getCombo, (err, rows) =>{
    if(err){
      return security.responseMessage(res, 500, err);
    }
    // checking for returned data
    if(rows[0] === undefined){
      return security.responseMessage(res, 406, "Combo Not Accepted. Invalied Data.");
    }

    let updateCombo = 'UPDATE combo SET combo_available = '+available+' WHERE id = '+id;

    db.mysql_db.query(updateCombo, (err) =>{
      if(err){
        return security.responseMessage(res, 500, err);
      }
        rows[0].combo_available = available;
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
   let getOrderArrayQuery = 'select orders.id, orders.combo_id, combo.name, locker_schedule.locker_nr, locker_schedule.pickup_time, orders.served\
    from orders inner join combo on orders.combo_id = combo.id \
    inner join locker_schedule on orders.id = locker_schedule.orders_id';

   db.mysql_db.query(getOrderArrayQuery, (err, rows) =>{
     if (err) {
      return security.responseMessage(res, 500, err);
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
   //RegExp to decode URI characters
   var find = '%3A';
   var re = new RegExp(find, "g");
   // Requestarguments escape() function to prevent SQL injection
   var pickupTime = escape(args.set_order.value.pickup_time);
   var comboID = escape(args.set_order.value.combo_id);
   //Decoding URI characters from pickupTime
   pickupTime = pickupTime.replace(re, ':');

   let availableQuery = 'select schedule_available, combo_available from schedule, combo\
    WHERE pickup_time = \''+pickupTime+'\' AND combo.id = '+comboID;

   db.mysql_db.query(availableQuery, (err, rows) =>{
     if(err){
       return security.responseMessage(res, 500, err);
     }
     /*
     Checking for returned data, if schedule and combo are available.
     */
     if(rows[0] === undefined){
       return security.responseMessage(res, 406, "Order Not Accepted. Invalied Data.");
     }else if(rows[0].schedule_available == 0){
       return security.responseMessage(res, 406, "Order Not Accepted. Time is not available.");
     }else if (rows[0].combo_available == 0){
       return security.responseMessage(res, 406, "Order Not Accepted. Combo is not available.");
     }else{
       // check for available locker
       let getAvailableLockerQuery = 'SELECT nr FROM locker WHERE NOT nr IN \
       (SELECT locker_nr FROM locker_schedule WHERE pickup_time= \''+pickupTime+'\')';

       db.mysql_db.query(getAvailableLockerQuery, (err, rows) =>{
         if(err){
           return security.responseMessage(res, 500, err);
         }
         let insertOrderQuery = '';

         if(rows.length == 1){
           insertOrderQuery = 'UPDATE schedule SET schedule_available = 0 WHERE pickup_time = \
           \''+pickupTime+'\';';
         }
         // insert Order function into next available locker.
         var lockerNR = rows[0].nr;
         var uuid = uuidv4();
         insertOrderQuery = insertOrderQuery+' INSERT INTO orders(id, combo_id, served) \
         VALUES(\''+uuid+'\','+comboID+', 0); \
         INSERT INTO locker_schedule(pickup_time, locker_nr, orders_id) \
         VALUES(\''+pickupTime+'\','+lockerNR+',\''+uuid+'\');'

         res.setHeader('Content-Type', 'application/json');

         db.mysql_db.query(insertOrderQuery, (err, rows) => {
           if (err) {
             return security.responseMessage(res, 500, err);
           }
           // generates a JSON Web Token for the unique orderID
           const payload = {
             exp: Math.floor(Date.now() / 1000) + (60*60*24), //expires in 24h
             userName: uuid,
             admin: 0
           };
           jwt.sign(payload, (err, token) =>{
               if (err) {
                 return security.responseMessage(res, 403, err);
               }
               res.statusCode = 200;
               res.end(JSON.stringify({
                 pickup_time: pickupTime,
                 locker_nr: lockerNR,
                 orders_id: uuid,
                 name: "User",
                 token: token
               }));
             });
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
       return security.responseMessage(res, 500, err);
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
   let query = 'SELECT distinct id, combo_id, ordered_at, pickup_time, served, locker_nr, PIN FROM orders, locker_schedule, locker\
   WHERE id = \''+escape(args.orderID.value)+'\' AND orders_id = \''+escape(args.orderID.value)+'\'\
   AND nr = locker_nr';

   res.setHeader('Content-Type', 'application/json');

   db.mysql_db.query(query, (err, rows) => {
     if (err) {
       return security.responseMessage(res, 500, err);
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
          return security.responseMessage(res, 500, err);
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
   let query = 'SELECT id, name, price, combo_available,\
    CONVERT(photo USING utf8)photo FROM combo';

   res.setHeader('Content-Type', 'application/json');

   db.mysql_db.query(query, (err, rows) => {
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     if(rows[0] === undefined){
              return security.responseMessage(res, 404, "No Combos. Invalied Data.");
     }else {
       res.statusCode = 200;
       res.end(JSON.stringify(rows));
     }

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
      return security.responseMessage(res, 500, err);
    }
      res.statusCode = 200;
      res.end(JSON.stringify(rows));
    });
}
