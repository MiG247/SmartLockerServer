'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');


exports.addLocker = function(args, res, next) {
  /**
   * Post a new locker entry. Only for Admin
   *
   * locker Locker Information to add a new Locker.
   * no response value expected for this operation
   **/
   var locker_nr = escape(args.locker.value.nr);
   var locker_PIN = escape(args.locker.value.PIN);
   if ((10000 <= locker_PIN) || (locker_PIN < 0)) {
     return security.responseMessage(res, 406, "Invalied PIN, PIN has to be > -1 and < 10000!");
   }

   let insertLockerQuery = 'INSERT INTO locker (nr, PIN) \
   VALUES('+locker_nr+','+locker_PIN+');';
   db.mysql_db.query(insertLockerQuery, (err, rows) =>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     return security.responseMessage(res, 200, "Successfully posted new Locker.");
   });
}

exports.deleteLocker = function(args, res, next) {
  /**
   * Delete a Locker entry. LockerNR is necessary. Only for Admin
   *
   * locker Locker Information to delete a Locker.
   * no response value expected for this operation
   **/
   var locker_nr = escape(args.locker.value.nr);

   let deleteLockerQuery =  'DELETE FROM locker WHERE nr = '+locker_nr+';';

   db.mysql_db.query(deleteLockerQuery, (err)=>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     return security.responseMessage(res, 200, "Successfully deleted Locker with the nr:"+locker_nr+".");
   });
}

exports.getLocker = function(args, res, next) {
  /**
   * Returns a locker Array. Only for Admin
   *
   * size Integer Size of array to receive (optional)
   * offset Integer Start index of the source (optional)
   * returns List
   **/
   let getLockerArrayQuery = 'SELECT * FROM locker;';

   db.mysql_db.query(getLockerArrayQuery, (err, rows) =>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     res.setHeader('Content-Type', 'application/json');
     res.statusCode = 200;
     res.end(JSON.stringify(rows));
   });
}

exports.update_Locker = function(args, res, next) {
  /**
   * Update a Locker entry. Old Locker is necessary. Only for Admin
   *
   * locker Locker Information to update Locker.
   * no response value expected for this operation
   **/
   var locker_nr = escape(args.locker.value.nr);
   var locker_PIN = escape(args.locker.value.PIN);

   let updateLockerQuery = 'UPDATE locker SET PIN = '+locker_PIN+'\
     WHERE nr = '+locker_nr+';';
   db.mysql_db.query(updateLockerQuery, (err) =>{
      if(err){
        return security.responseMessage(res, 500, err);
      }
      return security.responseMessage(res, 200, "Successfully updated a Locker entry.");
   });
}
