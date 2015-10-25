module.exports = (app) => {

  const adapters = []

  if (app.config.slack_api.token) {
    adapters.push(require("../adapters/slackAdapter")(app))
  }

  if (app.config.telegram_api.token) {
    adapters.push(require("../adapters/telegramAdapter")(app))
  }

  adapters.push(require("../adapters/webAdapter")(app))

  return adapters
}
