module.exports = (_app) => {
  class EchoBot {
    constructor() {
      this.name = "EchoBot"
    }

    onMessage(message) {
      message.send(message.text)
    }
  }

  return EchoBot
}
