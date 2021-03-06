class BaseParser {

  constructor() {
  }

  parseMessage(messageData) {
    console.log("parsing new message")
    console.log(messageData)
    const jsonMessage = JSON.parse(messageData)
    console.log( jsonMessage.type )
    if (jsonMessage.type === "message") {
      console.log("is message")
      // {"type":"message","channel":"G02AYQUC5","user":"U02AL5SGC","text":"karmaList","ts":"1440513466.000011","team":"T02AKCSRF"}
      return { message: jsonMessage.text, channel: jsonMessage.channel, userId: jsonMessage.user }
    }
    return null
  }
}

module.exports = BaseParser
