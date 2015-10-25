export default (_app) =>
  class EchoBot {
    constructor() {
      this.name = "EchoBot"
    }

    async onMessage(message) {
      message.command("echo", async match => await message.send(match[0]))
    }
  }
