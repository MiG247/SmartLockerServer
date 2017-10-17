'use strict';

const http = require('http');

http.ServerResponse.prototype.json = function (json, status) {
  if (this.responseSent) {
    return;
  }
  this.responseSent = true;
  this.setHeader('Content-Type', 'application/json');
  this.statusCode = status || 200;
  this.end(JSON.stringify(json || {}, null, 2));
};

http.ServerResponse.prototype.status = function (status) {
  if (this.responseSent) {
    return;
  }
  this.setHeader('Content-Type', 'text/plain');
  this.responseSent = true;
  this.statusCode = status;
  this.end('' + status);
};

http.ServerResponse.prototype.error = function (error) {
  if (this.responseSent) {
    return;
  }
  if (`${error}` === '[object Object]') {
    error = JSON.stringify(error);
  }
  this.setHeader('Content-Type', 'application/json');
  this.responseSent = true;
  this.statusCode = error.status || 500;
  if (error.status && Object.keys(error).length === 1) {
    return this.end();
  }
  this.end(JSON.stringify(error, null, 2));
};
