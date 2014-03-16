"use strict";

var EventEmitter = require('events').EventEmitter;
var utils = require('./utils');

var WS = function (url) {
    this.connection = null;
    this.url = url;

    EventEmitter.call(this);
};
utils.inherits(WS, EventEmitter);

WS.prototype.connect = function (url, protocols) {
    if (protocols) {
        this.connection = new WebSocket(url || this.url, protocols);
    } else {
        this.connection = new WebSocket(url || this.url);
    }
    this.setListeners();
};

WS.prototype.send = function (message) {
    if (this.ready()) {
        var data = JSON.stringify(message);
        this.connection.send(data);
    }

};

WS.prototype.setListeners = function () {
    this.connection.onopen = function () {
        this.emit('open', this);
    }.bind(this);
    this.connection.onerror = function (error) {
        this.emit('error', error);
    }.bind(this);
    this.connection.onmessage = function (message) {
        this.emit('message', JSON.parse(message.data));
    }.bind(this);
    this.connection.onclose = function () {
        this.emit('close');
    }.bind(this);
};

WS.prototype.disconnect = function () {
    this.connection.close();
};

WS.prototype.ready = function () {
    return this.connection && this.connection.readyState === 1;
};

module.exports = WS;