class TelegramParsedMessage {
  call(adapter, message) {
    message.parsedMessage = message.originalMessage
    message.parsedMessage.type = "message"
    return message
  }
}

module.exports = new TelegramParsedMessage()
