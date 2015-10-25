class TelegramResponder {
  async call(adapter, message) {
    let sendMessage
    if (message.parsedMessage.type === 'message'){
      sendMessage = (chatId) => {
        const wrappedFunc = async (text) => {
          await adapter.driver.client.send(chatId, text)
        }
        return wrappedFunc
      }
    } else {
      sendMessage = () => {}
    }

    message.send = sendMessage(message.parsedMessage.chat.id)
    return message
  }
}

module.exports = new TelegramResponder()
