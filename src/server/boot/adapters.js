import { extend, sample, map } from "lodash"
const rp = require("request-promise").defaults({ simple: false, followRedirect: false, resolveWithFullResponse: true})

module.exports = (app) => {

  function hear(regexp, cb) {
    const result = regexp.exec(this.text)
    if (result) cb(result)
  }

  function callAll(prop) {
    const args = Array.prototype.slice.call(arguments, 1)
    app.modules.Qx.map(app.bots, bot => {
      try {
        if (bot[prop]) bot[prop].apply(bot, args)
      } catch (err) {
        console.log(err)
      }
    })
  }

  function onEvent(event, responder) {
    event.send = responder
    event.hear = hear.bind(event)
    event.extend = extend
    event.sample = sample
    event.map = map
    event.http = rp

    callAll("onEvent", event)

    if (event.type === "message") {
      callAll("onMessage", event)
    }
  }

  if (app.config.slack_api.token) app.slackAdapter = require("../adapters/slackAdapter")(app, onEvent)
  if (app.config.telegram_api.token) app.telegramAdapter = require("../adapters/telegramAdapter")(app, onEvent)

  app.webAdapter = require("../adapters/webAdapter")(app, onEvent)

}
