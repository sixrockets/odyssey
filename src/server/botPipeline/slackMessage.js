class SlackMessage {

  constructor( originalMessage, parsedMessage = {} ){
    this.originalMessage = originalMessage;
    this.parsedMessage = parsedMessage;
  }

  newFromThis( parsedMessage ){
    return new SlackMessage(this.originalMessage, parsedMessage);
  }

}

module.exports = SlackMessage;
