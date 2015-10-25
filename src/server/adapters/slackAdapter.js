import { bind } from 'lodash'

const jsonParser = require('./middlewares/jsonParser')
const messageFiller = require('./middlewares/messageFiller')
const slackResponder = require('./middlewares/slackResponder')
const defaultSendLocation = require('./middlewares/defaultSendLocation')
const AdapterBase = require("./adapterBase")

module.exports = (app) => {
  const driver = { name: 'slack' }
  driver.users = app.slackUsers = require("./slackUsers")(app)
  driver.client = app.slackClient = new app.modules.AwesomeSlack(app.config.slack_api.token)
  const slackAdapter = new AdapterBase({
    middlewares: [ jsonParser, messageFiller, slackResponder, defaultSendLocation ],
    driver: driver
  })

  app.slackClient.on("connectionOpen", () => {
    app.slackUsers.saveUsers()
  })
  app.slackClient.on("messageReceived", bind(slackAdapter.onEvent, slackAdapter) )

  app.slackClient.startSocketConnection()

  return slackAdapter
}
