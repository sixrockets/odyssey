export default function slackResponder(adapter, message) {
  let sendMessage
  if (message.parsedMessage.type === "message") {
    sendMessage = (channel) => {
      const wrappedFunc = (text) => {
        adapter.driver.client.sendMessage(text, channel)
      }
      return wrappedFunc
    }
  } else {
    sendMessage = () => {}
  }

  message.send = sendMessage(message.parsedMessage.channel)
  return message
}
