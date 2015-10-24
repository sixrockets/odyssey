class JsonParser {
  call(adapter, message) {
    console.log('json parser')
    message.parsedMessage = JSON.parse( message.originalMessage )
    return message
  }
}

module.exports = new JsonParser()
