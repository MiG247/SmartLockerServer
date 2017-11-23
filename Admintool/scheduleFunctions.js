'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');


exports.addSchedule = function(args, res, next) {
  /**
   * Post a new Schedule entry. Only for Admin
   *
   * food AdmintoolScheduleInformation to add a new Schedule.
   * no response value expected for this operation
   **/
   var find = '%3A';
   var re = new RegExp(find, "g");
   var pickup_time = escape(args.schedule.value.pickup_time);
   var schedule_available = escape(args.schedule.value.schedule_available);

   pickup_time = pickup_time.replace(re, ':');

   let insertScheduleQuery = 'INSERT INTO schedule (pickup_time, schedule_available) \
   VALUES(\''+pickup_time+'\','+schedule_available+');';
   db.mysql_db.query(insertScheduleQuery, (err, rows) =>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     return security.responseMessage(res, 200, "Successfully posted new Schedule.");
   });
}

exports.update_Schedule = function(args, res, next) {
  /**
   * Update a Schedule entry. Old ScheduleID is necessary. Only for Admin
   *
   * food AdmintoolScheduleInformation to update Food.
   * no response value expected for this operation
   **/
   var find = '%3A';
   var re = new RegExp(find, "g");
   var pickup_time = escape(args.schedule.value.pickup_time);
   var schedule_available = escape(args.schedule.value.schedule_available);

   pickup_time = pickup_time.replace(re, ':');

   let updateScheduleQuery = 'UPDATE schedule SET schedule_available = \''+schedule_available+'\'\
     WHERE pickup_time = \''+pickup_time+'\';';
   db.mysql_db.query(updateScheduleQuery, (err) =>{
      if(err){
        return security.responseMessage(res, 500, err);
      }
      return security.responseMessage(res, 200, "Successfully updated a Schedule entry.");
   });
}

exports.deleteSchedule = function(args, res, next) {
  /**
   * Delete a Scheduleentry. ScheduleID is necessary. Only for Admin
   *
   * food Schedule Information to add a new Schedule.
   * no response value expected for this operation
   **/
   var find = '%3A';
   var re = new RegExp(find, "g");
   var pickup_time = escape(args.schedule.value.pickup_time);

   pickup_time = pickup_time.replace(re, ':');

   let deleteScheduleQuery =  'DELETE FROM schedule WHERE pickup_time = \''+pickup_time+'\';';

   db.mysql_db.query(deleteScheduleQuery, (err)=>{
     if (err) {
       return security.responseMessage(res, 500, err);
     }
     return security.responseMessage(res, 200, "Successfully deleted Schedule with the pickup_time: "+pickup_time+".");
   });
}
