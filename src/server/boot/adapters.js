import slackAdapter from "../adapters/slackAdapter"
import telegramAdapter from "../adapters/telegramAdapter"
import webAdapter from "../adapters/webAdapter"

module.exports = (app) => {
  const adapters = [webAdapter(app)]
  if (app.config.slack_api.token) adapters.push(slackAdapter(app))
  if (app.config.telegram_api.token) adapters.push(telegramAdapter(app))
  return adapters
}
