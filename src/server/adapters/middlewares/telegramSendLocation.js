import {partial} from "lodash"

class TelegramSendLocation {
  async call(adapter, message) {

    const sendLocation = (chatId) => {
      const wrappedFunc = async (location) => {
        await adapter.driver.client.sendLocation(chatId, location)
      }
    }

    message.sendLocation = sendLocation(message.parsedMessage.chat.id)
    return message
  }
}

module.exports = new TelegramSendLocation()
