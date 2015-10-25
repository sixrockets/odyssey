class JsonParser {
  call(adapter, message) {
    message.parsedMessage = JSON.parse( message.originalMessage )
    return message
  }
}

module.exports = new JsonParser()
