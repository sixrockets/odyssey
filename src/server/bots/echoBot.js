export default (_app) =>
  class EchoBot {
    constructor() {
      this.name = "EchoBot"
    }

    onMessage(message) {
      message.command("echo", match => message.send(match[0]))
    }
  }
