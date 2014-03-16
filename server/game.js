"use strict";

var util = require("util");
var EventEmitter = require("events").EventEmitter;

var Game = function (playerX, playerO) {
    EventEmitter.call(this);

    this.players = {
        X: playerX,
        O: playerO
    };

    this.turns = 0;
    this.current_turn = Game.TYPE_X;
    this.map = {X: [], O: []};
    this.draw = false;

    this.timeout_id = null;
    this.rules = {
        timeout: 30 * 1000 // 30 seconds per turn
    };
};
util.inherits(Game, EventEmitter);

Game.prototype.broadcast = function (message) {
    Object.keys(this.players).forEach(function (type) {
        this.players[type].send(message);
    }.bind(this));
};

Game.prototype.getEnemyType = function (type) {
    return type === Game.TYPE_X ? Game.TYPE_O : Game.TYPE_X;
};

Game.prototype.start = function () {
    Object.keys(this.players).forEach(function (type) {
        this.players[type].enterGame(type);
    }.bind(this));

    this.draw = false;
    this.setListeners();
    this.startTimer();
};

Game.prototype.setListeners = function () {
    Object.keys(this.players).forEach(function (type) {
        this.players[type].on('chat', function (data) {
            this.chat(this.getEnemyType(type), data);
        }.bind(this));

        this.players[type].on('turn', function (data) {
            this.turn(type, data);
        }.bind(this));

        this.players[type].on('gone', function () {
            this.end(type);
        }.bind(this));

    }.bind(this));
};

Game.prototype.chat = function (type, data) {
    this.players[type].send({type: 'chat', data: {text: data.text}});
};

Game.prototype.turn = function (type, data) {
    var enemy_type = this.getEnemyType(type);

    if (this.current_turn !== type) {
        this.end(enemy_type);
        return;
    }

    this.map[type].push(data);
    this.players[enemy_type].send({type: 'turn', data: data});
    this.turns++;
    this.current_turn = enemy_type;

    if (!this.isEndFor(type)) {
        this.startTimer();
    } else {
        this.end(enemy_type);
    }
};

Game.prototype.resetTimer = function () {
    clearTimeout(this.timeout_id);
};

Game.prototype.startTimer = function () {
    this.resetTimer();
    this.timeout_id = setTimeout(function () {
        this.end(this.current_turn);
    }.bind(this), this.rules.timeout);
};

Game.prototype.end = function (loser) {
    this.resetTimer();

    Object.keys(this.players).forEach(function (type) {
        if (!this.players[type]) {
            return;
        }

        if (this.draw) {
            this.players[type].end('draw');
        } else {
            loser === type ? this.players[type].end('lose') : this.players[type].end('win');
        }
        this.players[type] = null;
    }.bind(this));

    this.emit('end');
};

Game.prototype.isEndFor = function (type) {
    if (this.turns < 5) {
        return false;
    }

    var ctw = 3;
    var count = 3;
    var map = this.map[type];

    for (var i = 0; i < count; i++) {
        var vertical = 0;
        var horizontal = 0;
        var diagonal_r = 0;
        var diagonal_l = 0;

        for (var m = 0; m < map.length; m++) {
            var element = map[m];

            if (element.x === i && [0, 1, 2].indexOf(element.y) > -1) {
                vertical++;
            }
            if (element.y === i && [0, 1, 2].indexOf(element.x) > -1) {
                horizontal++;
            }

            if (element.x === 0 && element.y === 0) {
                diagonal_r++;
            }
            if (element.x === 2 && element.y === 2) {
                diagonal_r++;
            }
            if (element.x === 1 && element.y === 1) {
                diagonal_r++;
                diagonal_l++;
            }
            if (element.x === 2 && element.y === 0) {
                diagonal_l++;
            }
            if (element.x === 0 && element.y === 2) {
                diagonal_l++;
            }

        }

        if (horizontal === ctw || vertical === ctw || diagonal_l === ctw || diagonal_r === ctw) {
            return true;
        }
        if (this.turns === 9) {
            this.draw = true;
            return true;
        }
    }
    return false;
};

Game.TYPE_X = 'X';
Game.TYPE_O = 'O';

module.exports = Game;
