"use strict";

module.exports = (app) => {

  let baseParser = require('../botPipeline/middlewares/jsonParser'),
      messageFilter = require('../botPipeline/middlewares/messageFilter'),
      messageFilter = require('../botPipeline/middlewares/infoTransformer'),
      BotPipeline = require('../botPipeline/botPipeline');

  let botPipeline = new BotPipeline(baseParser, messageFilter, infoTransformer);
  app.botPipeline = botPipeline;
}
