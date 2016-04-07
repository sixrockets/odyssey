import {reject} from "lodash"
import path from "path"

export default (app) =>
  class AdminBot {
    constructor() {
      this.app = app
      this.name = "AdminBot"
    }

    sendBots(msg) {
      msg.send( msg.map(this.app.bots, bot => bot.name).join(", ") )
    }

    addBot(botName) {
      console.log(botName)
      const UnknownBot = this.rerequire(this.app.serverPath(`bots/${botName}`))
      this.app.bots.push(new UnknownBot(this.app))
    }

    rerequire(module) {
      const filename = path.join(module + ".js")
      delete require.cache[filename]
      return require(module)
    }

    onMessage(msg) {
      msg.command("bots", /^(list|\s*)$/, _match => this.sendBots(msg))

      msg.command("bots", /^remove (.*)$/, match =>{
        this.app.bots = reject(this.app.bots, bot => bot.name === match[1])
        this.sendBots(msg)
      })

      msg.command("bots", /^add (.*)$/, match =>{
        this.addBot(match[1])
        this.sendBots(msg)
      })
    }
  }
