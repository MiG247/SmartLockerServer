'use strict';

const fs = require('fs');
const db = require('../MySQL');
const jwt = require('../jwt');
const security  = require('../security/Functions');

exports.deleteOrder = function(args, res, next) {
  /**
   * Delete a Order entry. OrderID is necessary. Only for Admin
   *
   * order Order Information to delete a Order.
   * no response value expected for this operation
   **/
   var order_id = escape(args.order.value.id);
   var locker_nr = escape(args.order.value.locker_nr);
   var pickup_time = args.order.value.pickup_time;

   let deleteOrderQuery =  'DELETE FROM locker_schedule WHERE orders_id = \''+order_id+'\' \
   AND locker_nr = '+locker_nr+';\
   DELETE FROM orders WHERE id =\''+order_id+'\';';
   db.mysql_db.query(deleteOrderQuery, (err) =>{
      if(err){
        return security.responseMessage(res, 500, err);
      }
      return security.responseMessage(res, 200, "Successfully deleted a Order entry.");
   });
}
