import rp from "request-promise"
import { max } from "lodash"
import TelegramClient from "telegramClient"

export default (app, onEvent) => {

  const client = new TelegramClient()

  const fillMessage = message => {
    return {
      device: "telegram",
      driver: client,
      type: "message",
      sendLocation: client.sendLocation(message.chat),
      ...message
    }
  }

  const updateOffset = result => {
    if (result[0]) client.offset = max(result.map(update => update.update_id))
  }

  const tick = async () => {
    try {
      const response = await (client._getUpdates({offset: client.offset + 1}))
      const {result} = JSON.parse(response)
      updateOffset(result)

      result.map(({message}) =>
        onEvent(fillMessage(message), client.send(message.chat))
      )
    } catch (error) {
      console.error(error)
    }
  }

  setInterval(tick, 1000)

  return client
}
