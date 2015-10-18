class InfoTransformer {
  call( slackMessage) {
    const parsedMessage = slackMessage.parsedMessage
    const newParsedMessage = {...parsedMessage, userId: parsedMessage.user}
    return slackMessage.newFromThis( newParsedMessage )
  }
}

module.exports = new InfoTransformer()
