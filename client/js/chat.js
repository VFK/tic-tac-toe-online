"use strict";

var EventEmitter = require('events').EventEmitter;
var utils = require('./utils');

var Chat = function () {
    this.input = document.querySelector('div.input input');
    this.log = document.querySelector('div.messages ul');

    EventEmitter.call(this);
};
utils.inherits(Chat, EventEmitter);

Chat.prototype.init = function () {
    this.setListeners();
};

Chat.prototype.setListeners = function () {
    this.input.addEventListener('keypress', function (e) {
        if (e.which === 13 && e.target.value.trim().length) {
            e.preventDefault();
            this.emit('message', e.target.value);
            this.addMessage(e.target.value, Chat.OUTGOING);
            e.target.value = '';
        }
    }.bind(this), false);
};

Chat.prototype.setActive = function (state) {
    this.input.disabled = !state;
};

Chat.prototype.addMessage = function (message, type) {
    var li = document.createElement("li");
    li.innerText = message;
    li.className = type || Chat.INCOMING;

    this.log.appendChild(li);
    this.log.parentNode.scrollTop = this.log.parentNode.scrollHeight
};
Chat.prototype.clear = function() {
    this.log.innerHTML = '';
};

Chat.INCOMING = 'in';
Chat.OUTGOING = 'out';

module.exports = Chat;


