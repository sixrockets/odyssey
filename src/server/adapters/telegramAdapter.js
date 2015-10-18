import request from "request-promise"
import { max } from "lodash"

module.exports = (app, onEvent) => {
  let offset = 0

  const fillMessage = message => {
    return {device: "telegram", driver: {}, type: "message", ...message}
  }

  const call = action => qs => {
    const url = `https://api.telegram.org/bot${app.config.telegram_api.token}/${action}`
    return request({ url: url, qs: qs })
  }

  const sendMessage = channel => text => call("sendMessage")({ chat_id: channel, text: text })

  const updateOffset = result => {
    if (result[0]) offset = max(result.map(update => update.update_id))
  }

  const tick = () => {
    call("getUpdates")({offset: offset + 1})
      .then(message => JSON.parse(message))
      .then(message => {
        updateOffset(message.result)

        message.result.map(update => {
          const payload = {device: "telegram", driver: {}, type: "message", ...update.message}
          onEvent(payload, sendMessage(update.message.chat.id))
        })
      })
      .catch(console.error)
  }

  setInterval(tick, 1000)
}
