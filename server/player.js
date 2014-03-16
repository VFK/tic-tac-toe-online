"use strict";

var util = require("util");
var EventEmitter = require("events").EventEmitter;

var Player = function (connection) {
    EventEmitter.call(this);

    this.connection = connection;
    this.type = null;
    this.setListeners();
};
util.inherits(Player, EventEmitter);

Player.prototype.setListeners = function () {
    this.connection.on('message', function (message) {
        var json = JSON.parse(message);

        switch (json.type) {
            case 'restart':
                this.emit('restart');
                break;
            case 'turn':
                this.emit('turn', json.data);
                break;
            case 'chat':
                this.emit('chat', json.data);
                break;
            case 'win':
                this.end('win');
                break;
            case 'lose':
                this.end('lose');
                break;
        }
    }.bind(this));

    this.connection.on('error', function () {
        this.connection.close();
    }.bind(this));

    this.connection.on('close', function () {
        this.connection = null;
        this.emit('gone');
    }.bind(this));
};

Player.prototype.send = function (message) {
    if (this.ready()) {
        message = JSON.stringify(message);
        this.connection.send(message, function (error) {
            if (error) {
                // No one cares
            }
        }.bind(this));
    }
};

Player.prototype.ready = function () {
    return this.connection && this.connection.readyState === this.connection.OPEN;
};

Player.prototype.wait = function () {
    this.send({type: 'wait'});
};

Player.prototype.enterGame = function (type) {
    this.type = type;
    this.send({type: 'start', data: {type: type}});
};

Player.prototype.end = function(result) {
    this.send({type: 'end', data: {result: result}});
};

module.exports = Player;
