"use strict";

var Stats = function () {
    this.interval = null;
    this.seconds = 30;
    this.wins = 0;
    this.loses = 0;

    this.items = {
        users: document.querySelector('div.stats span.stats-users'),
        you: document.querySelector('div.stats span.stats-you'),
        games: document.querySelector('div.stats span.stats-games'),
        timer: document.querySelector('div.stats span.stats-timer'),
        info: document.querySelector('div.stats p.stats-info'),
        wins: document.querySelector('div.stats span.stats-wins'),
        loses: document.querySelector('div.stats span.stats-loses')
    };

    this.load();
};

Stats.prototype.update = function (data) {
    Object.keys(data).forEach(function (key) {
        this.items[key].innerHTML = data[key];
        localStorage.setItem('stats', JSON.stringify({wins: this.wins, loses: this.loses}));
    }.bind(this));
};

Stats.prototype.resetTimer = function () {
    clearInterval(this.interval);
    this.update({timer: this.seconds});
};

Stats.prototype.startTimer = function (seconds) {
    this.resetTimer();
    var timeout = seconds || this.seconds;

    this.interval = setInterval(function () {
        if (timeout === 0) {
            this.resetTimer();
        } else {
            this.update({timer: --timeout});
        }
    }.bind(this), 1000);
};

Stats.prototype.load = function() {
    this.wins = localStorage.getItem('wins') || 0;
    this.loses = localStorage.getItem('loses') || 0;
    this.update({wins: this.wins, loses: this.loses});
};

Stats.prototype.increase = function(type) {
    this[type]++;
    localStorage.setItem(type, this[type]);
    var obj = {};
    obj[type] = this[type];
    this.update(obj);
};


module.exports = Stats;