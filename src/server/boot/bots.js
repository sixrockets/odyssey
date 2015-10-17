"use strict";

let _ = require('lodash');

module.exports = (app) => {
  app.bots = [];
  _.each(app.config.bots, botName => {
    console.log(botName)
    let bot = require( `../bots/${botName}` )(app);
    app.bots.push( new bot() );
  })

}
