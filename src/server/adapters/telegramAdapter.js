import rp from "request-promise"
import { max } from "lodash"

export default (app, onEvent) => {
  class TelegramAdapter {
    constructor() {
      this.offset = 0
    }

    url(action, file) {
      return file
        ? `https://api.telegram.org/file/bot${app.config.telegram_api.token}/${file}`
        : `https://api.telegram.org/bot${app.config.telegram_api.token}/${action}`
    }

    command(action) {
      return qs => rp(action === "file"
        ? this.url(action, qs)
        : { url: this.url(action), qs: qs })
    }

    send({id}, text_) {
      const sender = text => this.command("sendMessage")({ chat_id: id, text })
      return text_ ? sender(text_) : sender
    }

    sendLocation({id}, location) {
      const sender = ({lat, lon}) => this._sendLocation({ chat_id: id, latitude: lat, longitude: lon })
      return location ? sender(location) : sender
    }

    get _sendLocation() {
      return this.command("sendLocation")
    }

    get _getUpdates() {
      return this.command("getUpdates")
    }

  }

  const client = new TelegramAdapter()

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
