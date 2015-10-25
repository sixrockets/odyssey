class TelegramParsedMessage {
  call(adapter, message) {
    message.parsedMessage.type = "message"
    return message
  }
}

module.exports = new TelegramParsedMessage()
