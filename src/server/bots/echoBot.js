class EchoBot {
  constructor(responder) {
    this.responder = responder;
    this.name = "EchoBot";
  }

  onMessage(message) {
    message.send(message.text)
  }
}

module.exports.new_bot = (app) => {
  return new EchoBot(app.slackClient);
}
