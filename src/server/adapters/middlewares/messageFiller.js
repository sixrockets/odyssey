class MessageFiller {
  call(adapter, message) {
    console.log('message filler')
    message.device = adapter.driver.name
    message.driver = adapter.driver
    return message
  }
}

module.exports = new MessageFiller()
