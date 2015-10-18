import { extend, sample, map } from "lodash"
const rp = require("request-promise").defaults({ simple: false, followRedirect: false, resolveWithFullResponse: true})

module.exports = (app) => {

  function hear(regexp, cb) {
    const result = regexp.exec(this.text)
    if (result) cb(result)
  }

  // check if the commandText is at beginning of message
  function command(commandText, regExp, cb) {
    const hasRegExp = (cb === void 0)
    const callback = hasRegExp ? regExp : cb
    const regexp = hasRegExp ? /.*/ : regExp
    const commandRegexp = new RegExp(`^[/@#]?${commandText}\\s*(.*)$`, "i")
    let result = commandRegexp.exec(this.text)
    result = result && regexp.exec(result[1])
    if (result) callback(result)
  }

  function callAll(prop) {
    const args = Array.prototype.slice.call(arguments, 1)
    app.modules.Qx.map(app.bots, bot => {
      try {
        if (bot[prop]) bot[prop].apply(bot, args)
      } catch (err) {
        console.log(err)
        console.log(err.stack)
      }
    })
  }

  function onEvent(event, responder) {
    event.send = responder
    event.hear = hear.bind(event)
    event.command = command.bind(event)
    event.extend = extend
    event.sample = sample
    event.map = map
    event.http = rp
    event.sendLocation = event.sendLocation || (location => {
      event.send(`https://www.google.com/maps/search/${location.lat},${location.lon}`)
    })
    callAll("onEvent", event)

    if (event.type === "message") {
      callAll("onMessage", event)
    }
  }

  if (app.config.slack_api.token) app.slackAdapter = require("../adapters/slackAdapter")(app, onEvent)
  if (app.config.telegram_api.token) app.telegramAdapter = require("../adapters/telegramAdapter")(app, onEvent)

  app.webAdapter = require("../adapters/webAdapter")(app, onEvent)

}
