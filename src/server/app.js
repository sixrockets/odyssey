"use strict";

let path = require('path'),
    config = require('./config');




var serverPath = function(route){
  return path.join(__dirname, route);
}

var app = {};

app.config = config();
require('./boot/index')(app);

app.serverPath = serverPath;


// app.webServer = require('./webServer')(app)

module.exports = app;
