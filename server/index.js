"use strict";

var WebSocketServer = require('ws').Server;
var Game = require('./game');
var Player = require('./player');

var waiting = [];
var games = [];

var server = new WebSocketServer({port: 8080});
server.on('connection', function (connection) {
    var player = new Player(connection);
    start(player);
});

function start(player) {
    player.on('restart', function () {
        player.removeAllListeners();
        start(player);
    });

    if (!waiting.length) {
        waiting.push(player);
        player.wait();
    } else {
        var enemy = waiting.pop();
        if (enemy.ready()) {
            var game = new Game(enemy, player);
            game.once('end', function () {
                games.splice(games.indexOf(game), 1);
                game = null;
            });

            game.start();
            games.push(game);

            var msg = {
                type: 'stat',
                data: {
                    users: server.clients.length,
                    games: games.length
                }
            };

            games.forEach(function (game) {
                game.broadcast(msg);
            });
        } else {
            enemy = null;
            waiting.push(player);
            player.wait();
        }
    }
}