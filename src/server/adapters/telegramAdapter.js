import rp from "request-promise"
import { max } from "lodash"

module.exports = (app, onEvent) => {
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
      return qs =>
        action === "file"
          ? rp(this.url(action, qs))
          : rp({ url: this.url(action), qs: qs })
    }

    send(channel, text_) {
      const sender = text => this.command("sendMessage")({ chat_id: channel.id, text })
      return text_ ? sender(text_) : sender
    }

    sendLocation(channel, location_) {
      const sender = location => this.command("sendLocation")({ chat_id: channel.id, latitude: location.lat, longitude: location.lon })
      return location_ ? sender(location_) : sender
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

  const tick = () => {
    client.command("getUpdates")({offset: client.offset + 1})
      .then(message => JSON.parse(message))
      .then(message => {
        updateOffset(message.result)

        message.result.map(update =>
          onEvent(fillMessage(update.message), client.send(update.message.chat))
        )

      })
      .catch(console.error)
  }

  setInterval(tick, 1000)

  return client
}
