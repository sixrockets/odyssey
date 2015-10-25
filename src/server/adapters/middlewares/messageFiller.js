class MessageFiller {
  call(adapter, message) {
    message.device = adapter.driver.name
    message.driver = adapter.driver
    return message
  }
}

module.exports = new MessageFiller()
