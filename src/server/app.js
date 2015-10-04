"use strict";

let path = require('path'),
    config = require('./config'),
    rp = require('request-promise').defaults({ simple: false, followRedirect: false, resolveWithFullResponse: true});

import { extend, sample, map } from 'lodash';

var serverPath = function(route){
  return path.join(__dirname, route);
}

var app = {};

require('./boot/index')(app);

app.serverPath = serverPath;

app.config = config();

app.models = require( app.serverPath( path.join('models', 'index') ) )(app);
app.redisClient = require( app.serverPath( 'redisClient' ))(app);

app.bots = app.modules._.map(app.config.bots, botName => {
  console.log(botName)
  var bot = require(app.serverPath(`bots/${botName}`));
  return new bot(app);
})

let hear = function (regexp, cb) {
  var result
  if (result = regexp.exec(this.text)) cb(result)
}

let callAll = function(prop){
  let args = Array.prototype.slice.call(arguments, 1)
  app.modules.Qx.map(app.bots, function(bot){
    try {
      if(bot[prop]) bot[prop].apply(bot, args);
    } catch (err) {
      console.log(err)
    }
  });
}

let onEvent = function(event, responder){
    event.send = responder
    event.hear = hear.bind(event)
    event.extend = extend
    event.sample = sample
    event.map = map
    event.http = rp

    callAll('onEvent', event)

    if (event.type == "message") {
      callAll('onMessage', event)
    }
}

if (app.config.slack_api.token){
  app.slackAdapter = require('./adapters/slackAdapter')(app, onEvent)
  console.log('slackAdapter loaded')
} else {
  console.log('slackAdapter not loaded')
}

if (app.config.telegram_api.token){
  app.telegramAdapter = require('./adapters/telegramAdapter')(app, onEvent)
  console.log('telegramAdapter loaded')
} else {
  console.log('telegramAdapter not loaded')
}

app.webAdapter = require('./adapters/webAdapter')(app, onEvent)

// app.webServer = require('./webServer')(app)

module.exports = app;
