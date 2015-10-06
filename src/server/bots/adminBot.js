var _ = require('lodash'),
    path = require('path');

export default class AdminBot {
  constructor(app) {
    this.app = app
    this.name = "AdminBot";
  }

  sendBots(msg){
    msg.send( msg.map(this.app.bots, bot => bot.name).join(", ") )
  }

  addBot(botName){
    console.log(botName)
    var bot = this.rerequire(this.app.serverPath(`bots/${botName}`));
    this.app.bots.push(new bot(this.app));
  }

  rerequire(module){
    var filename = path.join(module + '.js')
    delete require.cache[filename]
    return require(module)
  }

  onMessage(msg){
    msg.command("bots", /^(list|\s*)$/, match => this.sendBots(msg))

    msg.command("bots", /^remove (.*)$/, match =>{
      this.app.bots = _.reject(this.app.bots, bot => bot.name == match[1]);
      this.sendBots(msg);
    })

    msg.command("bots", /^add (.*)$/, match =>{
      this.addBot(match[1]);
      this.sendBots(msg);
    })
  }
}
