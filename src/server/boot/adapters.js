"use strict";

import { extend, sample, map } from 'lodash';
let rp = require('request-promise').defaults({ simple: false, followRedirect: false, resolveWithFullResponse: true});

module.exports = (app) => {

  let hear = function (regexp, cb) {
    var result
    if (result = regexp.exec(this.text)) cb(result)
  }

  let callAll = function(prop){
    let args = Array.prototype.slice.call(arguments, 1)
    console.log(prop);
    console.log(app.bots);
    app.modules.Qx.map(app.bots, function(bot){
      console.log(bot);
      try {
        console.log('on try');
        console.log( bot[prop] )
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
        console.log('calling callAll');
        callAll('onMessage', event);
      }
  }

  if (app.config.slack_api.token) app.slackAdapter = require('../adapters/slackAdapter')(app, onEvent);
  if (app.config.telegram_api.token) app.telegramAdapter = require('../adapters/telegramAdapter')(app, onEvent)

  app.webAdapter = require('../adapters/webAdapter')(app, onEvent)

}
