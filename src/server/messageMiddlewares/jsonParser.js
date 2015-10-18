class JsonParser {
  call( slackMessage) {
    return slackMessage.newFromThis( JSON.parse( slackMessage.originalMessage ) )
  }
}

module.exports = new JsonParser()
