'use strict';

var Game = require('../server/game');
require('should');

describe('The winner', function () {
    var game = new Game();
    game.turns = 6;

    // Horizontal
    it('should be in top horizontal row', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.draw.should.be.false;
    });
    it('should be in middle horizontal row', function () {
        game.map.X = [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.draw.should.be.false;
    });
    it('should be in bottom horizontal row', function () {
        game.map.X = [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.draw.should.be.false;
    });

    // Vertical
    it('should be in left vertical row', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.draw.should.be.false;
    });
    it('should be in middle vertical row', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.draw.should.be.false;
    });
    it('should be in right vertical row', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.draw.should.be.false;
    });

    // Diagonal
    it('should be in left-to-right diagonal row', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 2 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.draw.should.be.false;
    });
    it('should be in right-to-left diagonal row', function () {
        game.map.X = [
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 2 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.draw.should.be.false;
    });

    // Other
    it('should be here', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 }
        ];
        game.map.O = [
            { x: 2, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.isEndFor(Game.TYPE_O).should.be.false;
        game.draw.should.be.false;
    });
    it('should NOT be here', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 2 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.false;
        game.draw.should.be.false;
    });
    it('should NOT be here', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 2 },
            { x: 2, y: 1 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.false;
        game.draw.should.be.false;
    });
    it('should NOT be here', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 0, y: 2 },
            { x: 2, y: 2 }
        ];
        game.isEndFor(Game.TYPE_X).should.be.false;
        game.draw.should.be.false;
    });
    it('should be draw', function () {
        game.map.X = [
            { x: 0, y: 0 },
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 }
        ];
        game.map.O = [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 2 }
        ];
        game.turns = 9;
        game.isEndFor(Game.TYPE_X).should.be.true;
        game.isEndFor(Game.TYPE_O).should.be.true;
        game.draw.should.be.true;
    });
});