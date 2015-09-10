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

// app.slackStreamer = require(serverPath('slackStreamer'))(app);
app.slackUsers = require(serverPath('slackUsers'))(app);

app.bots = app.modules._.map(app.config.bots, function(botName){return require( serverPath(`bots/${botName}`) )(app)})


let streamToBots = function(messageInfo){
  console.log('streamToBots');
  app.modules.Qx.map(app.bots, function(bot){bot.tick(messageInfo)});
}

app.slackClient = new app.modules.AwesomeSlack(app.config.slack_api.token);

app.slackClient.on('connectionOpen', function(){
  app.slackUsers.saveUsers();
});
app.slackClient.on('messageReceived', streamToBots);

app.slackClient.startSocketConnection();
module.exports = app;
