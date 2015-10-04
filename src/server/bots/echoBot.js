export default class EchoBot {
  constructor() {
    this.name = "EchoBot";
  }

  onMessage(message) {
    message.send(message.text)
  }
}
