"use strict";

let _ = require('lodash');

module.exports = (app) => {
  app.bots = [];
  _.each(app.config.bots, botName => {
    console.log('loading ' + botName);
    let BotClass = require( `../bots/${botName}` )(app),
        bot = new BotClass();
    app.bots.push( bot );
  })

}
