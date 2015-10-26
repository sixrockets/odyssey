import { bind } from "lodash"
import TelegramClient from "./telegramClient"

const telegramResponder = require("./middlewares/telegramResponder")
const telegramParsedMessage = require("./middlewares/telegramParsedMessage")
const telegramSendLocation = require("./middlewares/telegramSendLocation")
const messageFiller = require("./middlewares/messageFiller")
const AdapterBase = require("./adapterBase")

export default app => {
  const driver = {
    name: "telegram",
    client: new TelegramClient(app.config.telegram_api.token)
  }

  const telegramAdapter = new AdapterBase({
    middlewares: [telegramParsedMessage, messageFiller, telegramResponder, telegramSendLocation ],
    driver: driver
  })

  driver.client.on("messageReceived", bind(telegramAdapter.onEvent, telegramAdapter) )

  driver.client.start()

  return telegramAdapter
}
