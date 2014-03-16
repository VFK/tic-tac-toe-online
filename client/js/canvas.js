"use strict";

var EventEmitter = require('events').EventEmitter;
var utils = require('./utils');

var Canvas = function () {
    this.map = {X: [], O: []};
    this.inGame = false;
    this.newGameAllowed = false;

    this.type = 'X';
    this.currentTurn = 'X';

    this.options = {
        count: 3,
        side: 100,
        line: 10
    };

    EventEmitter.call(this);
};
utils.inherits(Canvas, EventEmitter);

Canvas.prototype.init = function () {
    this.canvas = document.getElementById('board');
    this.context = this.canvas.getContext("2d");
    this.context.lineWidth = this.options.line;

    this.drawBoard();
    this.setListeners();
};

Canvas.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
    this.map = {X: [], O: []};
    this.currentTurn = 'X';
};

Canvas.prototype.drawBoard = function () {
    var op = this.options;

    for (var x = 0; x < op.count; x++) {
        for (var y = 0; y < op.count; y++) {
            this.context.strokeRect((x * op.side) + (op.line / 2), (y * op.side) + (op.line / 2), op.side, op.side);
        }
    }
};

Canvas.prototype.drawX = function (x, y) {
    var op = this.options;
    this.context.beginPath();
    this.context.moveTo((x * op.side) + (op.line * 2), (y * op.side) + (op.line * 2));
    this.context.lineTo((x * op.side) + op.side - op.line, (y * op.side) + op.side - op.line);
    this.context.moveTo((x * op.side) + (op.line * 2), (y * op.side) + op.side - op.line);
    this.context.lineTo((x * op.side) + op.side - op.line, (y * op.side) + (op.line * 2));
    this.context.closePath();
    this.context.stroke();
};

Canvas.prototype.drawO = function (x, y) {
    this.context.beginPath();
    this.context.arc(
            this.options.side * (x + 0.5) + (this.options.line / 2),
            this.options.side * (y + 0.5) + (this.options.line / 2),
            (this.options.side * 0.5) - (this.options.line * 1.5),
        0, Math.PI * 2, true
    );
    this.context.closePath();
    this.context.stroke();
};

Canvas.prototype.draw = function (type, x, y) {
    if (this.canDraw(type, x, y)) {
        if (type === 'X') {
            this.drawX(x, y);
            this.map.X.push([x, y]);
        } else {
            this.drawO(x, y);
            this.map.O.push([x, y]);
        }
        this.currentTurn = this.getEnemyType(type);
        return true;
    }
    return false;
};

Canvas.prototype.drawText = function (text) {
    this.context.save();
    this.context.globalAlpha = '0.8';
    this.context.fillStyle = '#fff';
    this.context.fillRect(0,0, 310,310);
    this.context.restore();

    this.context.font = "bold 30pt Helvetica";
    this.context.textAlign = "center";
    this.context.fillText(text, 155, 150, 310);

    this.context.font = "bold 10pt Helvetica";
    this.context.fillText('To restart the game click (or tap) here', 155, 165, 310);
};

Canvas.prototype.setListeners = function () {
    this.canvas.addEventListener('click', function (e) {
        if(!this.inGame && this.newGameAllowed) {
            this.emit('restart');
            return false;
        }

        // Correct offset for Firefox
        var offsetX = e.offsetX || e.pageX - e.target.getBoundingClientRect().left - window.scrollX;
        var offsetY = e.offsetY || e.pageY - e.target.getBoundingClientRect().top - window.scrollY;

        var x = Math.floor(offsetX / this.options.side);
        var y = Math.floor(offsetY / this.options.side);

        if (this.draw(this.type, x, y)) {
            this.emit('turn', {x: x, y: y});
        }
    }.bind(this), false);

    this.canvas.addEventListener('touchend', function (e) {
        e.preventDefault();

        if(!this.inGame && this.newGameAllowed) {
            this.emit('restart');
            return false;
        }

        var offsetX = e.changedTouches[0].pageX - e.changedTouches[0].target.offsetLeft;
        var offsetY = e.changedTouches[0].pageY - e.changedTouches[0].target.offsetTop;

        var x = Math.floor(offsetX / this.options.side);
        var y = Math.floor(offsetY / this.options.side);

        if (this.draw(this.type, x, y)) {
            this.emit('turn', {x: x, y: y});
        }
    }.bind(this), false);

    this.canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
    });


};

Canvas.prototype.getEnemyType = function (type) {
    return type === 'X' ? 'O' : 'X';
};

Canvas.prototype.canDraw = function (type, x, y) {
    if (!this.inGame) {
        return false;
    }
    if (this.currentTurn !== type) {
        return false;
    }
    var map = this.map.X.concat(this.map.O);

    for (var i = 0; i < map.length; i++) {
        if (map[i][0] === x && map[i][1] === y) {
            return false;
        }
    }
    return true;
};

module.exports = Canvas;
