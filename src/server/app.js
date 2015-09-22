"use strict";

let express = require('express'),
    express_session = require('express-session'),
    path = require('path'),
    config = require('./config');


var serverPath = function(route){
  return path.join(__dirname, route);
}

var app = {};

app.webServer = express();
app.config = config();

require('./boot/index')(app);

app.serverPath = serverPath;

var hbs = require('express-hbs');

// Use `.hbs` for extensions and find partials in `views/partials`.
app.webServer.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/../../views/partials'
}));
app.webServer.set('view engine', 'hbs');
app.webServer.set('views', __dirname + '/../../views');

app.webServer.use(express_session({ secret: app.config.secret, resave: true, saveUninitialized: true }));



let tickBots = function(messageInfo){
  app.modules.Qx.map(app.bots, function(bot){
    bot.tick && bot.tick(messageInfo)
  });
}

let onMessageBots = function (messageInfo) {
    var message = JSON.parse(messageInfo);

    console.dir(message);

    var responder = function responder(text) {
      app.slackClient.sendMessage(text, message.channel);
    };

    if (message.type == "message") {
      app.modules.Qx.map(app.bots, function(bot){
        bot.onMessage && bot.onMessage(message, responder);
      });

    }
};


app.slackClient.startSocketConnection();
module.exports = app;
