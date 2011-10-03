/*
 * hook-shim.js: A slimmed down minimal Hook.js class for the browser
 *
 * run './bin/browser' to convert this script to a browser friendly format
 * (C) 2011 Nodejitsu Inc.
 * MIT LICENCE
 *
 */

var dnode  = require('dnode'),
    path   = require('path'),
    EventEmitter = require('eventemitter2').EventEmitter2;


//
// Create a shim for the base hook.io Hook class
//
var Hook = exports.Hook = function (options) {
  self.reconnectionTimer = null;
  EventEmitter.call(this, { delimiter: '::', wildcard: true });
};

//
// Hook inherit from `EventEmitter2`.
//
inherits(Hook, EventEmitter);

Hook.prototype.connect = function () {

  var self = this;

  //
  // Create a dnode / socketio client which exposes,
  // a `message` function
  //
  var client = dnode({
    message: function(event, data){
      self.emit(event, data, function(){}, false);
    },
    report: function(message) {
    }
  });

  //
  // connect() will recursively call itself,
  // until a connection is ready
  //
  // When the connection ends connect() will,
  // continue to attempt to reconnect
  //
  function connect() {
    client.connect(function (_remote, conn) {
        self.remote = _remote; 
        clearInterval(reconnectionTimer);
        conn.on('end', function(){
          //
          //  Attempt reconnection
          //
          reconnectionTimer = setInterval(function(){
            connect();
          }, 3000)
        });
        self.emit('browser::ready');
    });
  }
  
  connect();
};

Hook.prototype.start = function () {
  this.connect();
};


//
// Shim of Hook.prototype.emit from core hook.io project
//
Hook.prototype.emit = function (event, data, callback, broadcast) {

  //
  // Curry arguments to support multiple styles,
  // of callback passing.
  //
  if(typeof data === 'function') {
    callback = data;
    data = null;
  }

  if(typeof callback !== 'function') {
    broadcast = callback || true;
    callback = new Function();
  }
  
  if (event === 'newListener') {
    EventEmitter.prototype.emit.call(this, event, data, callback, broadcast);
    return;
  }

  //
  // Log all emitted events
  //
  // console.log(this.name, event, data);

  //
  // If there is a remote, and this message is intended for broadcast,
  // then we send the message out through the dnode remote
  //
  if (typeof this.remote === 'object' && broadcast) {
    this.remote.message(event, data, callback);
  }
  EventEmitter.prototype.emit.call(this, event, data, callback, broadcast);
  return;
}

//
// Simple Inherits from node.js core
//
function inherits (ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};
