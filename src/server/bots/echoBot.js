export default class EchoBot {
  constructor() {
    this.name = "EchoBot";
  }

  onMessage(message, responder) {
    responder(message.text)
  }
}
