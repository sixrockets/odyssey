"use strict"

module.exports = (app) => {

  if (app.config.slack_api.token !== 'undefined') require("../adapters/slackAdapter")(app)

  if (app.config.telegram_api.token) app.telegramAdapter = require("../adapters/telegramAdapter")(app)
  //
  // app.webAdapter = require("../adapters/webAdapter")(app, onEvent)

}
