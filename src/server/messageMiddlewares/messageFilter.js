class MessageFilter {
  call(slackMessage) {
    if (slackMessage.parsedMessage.type === "message") {
      return slackMessage
    }
    throw new Error("not a message")
  }
}

module.exports = new MessageFilter()
