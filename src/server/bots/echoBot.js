module.exports = (_app) => {
  class EchoBot {
    constructor() {
      this.name = "EchoBot"
    }

    onMessage(message) {
      message.command("echo", match => message.send(match[0]))
      // message.send(message.text)
    }
  }

  return EchoBot
}
