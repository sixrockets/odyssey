"use strict";

let _ = require('lodash');

module.exports = (app) => {

  let baseParser = require('../botPipeline/middlewares/jsonParser'),
      messageFilter = require('../botPipeline/middlewares/messageFilter'),
      infoTransformer = require('../botPipeline/middlewares/infoTransformer'),
      BotPipeline = require('../botPipeline/botPipeline');

  let botPipeline = new BotPipeline(baseParser, messageFilter, infoTransformer);

  _.each(app.config.bots, botName => {
    console.log(botName)
    botPipeline.useBot( require(`../bots/${botName}`).new_bot(app)  )
  })


  app.botPipeline = botPipeline;
}
