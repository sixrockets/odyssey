class EchoBot {
  constructor(responder) {
    this.responder = responder;
    this.name = "EchoBot";
  }

  onMessage(slackMessage) {
    let message = slackMessage.parsedMessage;
    this.responder.sendMessage(message.text, message.channel);
  }
}

module.exports.new_bot = (app) => {
  return new EchoBot(app.slackClient);
}
