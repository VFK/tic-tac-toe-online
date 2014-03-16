# Tic-Tac-Toe Online [![Build Status](https://travis-ci.org/VFK/tic-tac-toe-online.png?branch=master)](https://travis-ci.org/VFK/tic-tac-toe-online)

Open source massive multiplayer online tic-tac-toe game. Play it at http://ttt.vfk.me

## Overview
World of Warcraft has finally met a worthy competitor :)
This project uses some nifty tools like Browserify for modular code and Gulp for building purposes.
This project intended to be modern. Server side was tested on Node.js 0.9+.
Client side does not use any dirty hacks or polyfills for ancient pre-browser era,
so it should work in IE10+ and all browsers.

## Configuration
As of now the game doesn't have any centralized way to manage configuration options.
It should be added later on.

#### Server side
* Port. In `server/index.js`, find

```javascript
var server = new WebSocketServer({port: 8080});
```

#### Client side
* Url for websockets connection. In `client/index.js` find

```javascript
var ws = new WS('ws://127.0.0.1:8080');
```

* Tracking code. In `client/inc` edit **analytics** file. Delete if not needed.
* Advertisement code. In `client/inc` edit **adsense** file. Delete if not needed.


## Building
The client side leverages [Browserify](http://browserify.org/) so it must be built before using.

Install dependencies using npm:
```
npm install
```
As a build tool we use [Gulp](http://gulpjs.com/), so it needs to be installed globally:
```
npm install -g gulp
```
Now you can build your own game:
```javascript
// Build development version
gulp dev

// Or build the production version
gulp prod
```
Build task will create a new folder called `build`with client-side files.

## Usage
Run **index.js** in **server** folder through node:
```
node server/index.js
```
Open **index.html** from **build** folder in the browser. Enjoy.
