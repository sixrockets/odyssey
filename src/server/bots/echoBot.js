module.exports = (app) => {
  class EchoBot {
    constructor(responder) {
      this.responder = responder;
      this.name = "EchoBot";
    }

    onMessage(message) {
      message.send(message.text)
    }
  }

  return EchoBot;
}
