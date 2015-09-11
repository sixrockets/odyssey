"use strict";

let express = require('express'),
    express_session = require('express-session'),
    path = require('path'),
    config = require('./config');


var serverPath = function(route){
  return path.join(__dirname, route);
}

var app = express();

require('./boot/index')(app);

app.serverPath = serverPath;

app.config = config();

var hbs = require('express-hbs');

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/../../views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/../../views');

app.use(express_session({ secret: app.config.secret, resave: true, saveUninitialized: true }));

app.models = require( serverPath( path.join('models', 'index') ) )(app);

app.redisClient = require( serverPath( 'redisClient' ))(app);

app.slackUsers = require(serverPath('slackUsers'))(app);

app.bots = app.modules._.map(app.config.bots, function(botName){ return require( serverPath(`bots/${botName}`) ).new_bot(app) })


let tickBots = function(messageInfo){
  app.modules.Qx.map(app.bots, function(bot){
    bot.tick && bot.tick(messageInfo)
  });
}

let onMessageBots = function (messageInfo) {
    var message = JSON.parse(messageInfo);

    var responder = function responder(text) {
      app.slackClient.sendMessage(text, message.channel);
    };

    if (message.type == "message") {
      app.modules.Qx.map(app.bots, function(bot){
        bot.onMessage && bot.onMessage(message, responder);
      });

    }
};

let streamToBots = function(messageInfo){
  console.log('streamToBots');
  tickBots(messageInfo)
  onMessageBots(messageInfo)
};

app.slackClient = new app.modules.AwesomeSlack(app.config.slack_api.token);

app.slackClient.on('connectionOpen', function(){
  app.slackUsers.saveUsers();
});
app.slackClient.on('messageReceived', streamToBots);

app.slackClient.startSocketConnection();
module.exports = app;
