"use strict";

var Canvas = require('./canvas');
var WS = require('./ws');
var Chat = require('./chat');
var Stats = require('./stats');

var canvas = new Canvas();
canvas.init();

var chat = new Chat();
chat.init();

var ws = new WS('ws://127.0.0.1:8080');
ws.connect();

var stats = new Stats();

ws.on('open', function () {
    chat.on('message', function (message) {
        var obj = {
            type: 'chat',
            data: {
                text: message
            }
        };
        ws.send(obj);
    });

    canvas.on('turn', function (args) {
        var obj = {
            type: 'turn',
            data: {
                x: args.x,
                y: args.y
            }
        };
        ws.send(obj);
        stats.startTimer();
        stats.update({info: 'Wait for your enemy\'s turn' });
    });

    canvas.on('restart', function () {
        ws.send({type: 'restart'});
    })
});

ws.on('message', function (message) {
    var msg;
    switch (message.type) {
        case 'wait':
            canvas.clear();
            canvas.newGameAllowed = false;
            stats.update({info: 'Waiting for other player...'});
            chat.clear();
            chat.setActive(false);
            break;
        case 'start':
            var type = message.data.type;
            canvas.type = type;
            canvas.inGame = true;
            canvas.newGameAllowed = false;
            canvas.clear();

            chat.clear();
            chat.setActive(true);

            msg = type === 'X' ? 'Make your turn before the timer runs out' : 'Wait for your enemy\'s turn';
            stats.update({you: type, info: msg});

            stats.startTimer();
            break;
        case 'chat':
            chat.addMessage(message.data.text, Chat.INCOMING);
            break;
        case 'turn':
            canvas.draw(canvas.currentTurn, message.data.x, message.data.y);
            stats.update({info: 'Make your turn until the timer runs out'});
            stats.startTimer();
            break;
        case 'end':
            if (message.data.result === 'win') {
                msg = 'Congratulations! What a game!';
                canvas.drawText('YOU WIN!');
                stats.increase('wins');
            } else if (message.data.result === 'lose') {
                msg = 'You\'ve lost to someone from the internet! Time for revenge!';
                canvas.drawText('YOU LOSE!');
                stats.increase('loses');
            } else {
                msg = 'No winners, no losers... Just dissatisfaction';
                canvas.drawText('DRAW!');
            }
            chat.setActive(false);
            stats.update({info: msg, you: '...'});

            canvas.inGame = false;
            canvas.newGameAllowed = true;
            stats.resetTimer();
            break;
        case 'stat':
            stats.update(message.data);
            break;
    }
});

ws.on('close', function () {
    stats.resetTimer();
    canvas.inGame = false;
    chat.setActive(false);
    stats.update({info: 'Disconnected'});
});
