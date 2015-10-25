import { bind } from "lodash"
import TelegramClient from "./telegramClient"

const jsonParser = require('./middlewares/jsonParser')
const telegramResponder = require('./middlewares/telegramResponder')
const telegramParsedMessage = require('./middlewares/telegramParsedMessage')
const telegramSendLocation = require('./middlewares/telegramSendLocation')
const messageFiller = require('./middlewares/messageFiller')
const AdapterBase = require("./adapterBase")

module.exports = (app) => {

  const driver = { name: 'telegram' }
  driver.client = new TelegramClient(app.config.telegram_api.token)

  const telegramAdapter = new AdapterBase({
    middlewares: [telegramParsedMessage, messageFiller, telegramResponder, telegramSendLocation ],
    bots: app.bots,
    driver: driver
  })

  driver.client.on("messageReceived", bind(telegramAdapter.onEvent, telegramAdapter) )

  driver.client.start()

}
