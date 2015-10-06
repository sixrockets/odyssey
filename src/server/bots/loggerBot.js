export default class LoggerBot {
  constructor() {
    this.name = "LoggerBot";
  }

  onEvent(event){
    if (event.type == "presence_change") return void 0
    if (event.type == "hello") return void 0
    if (event.type == "user_typing") return void 0

    console.log("------")
    console.dir(event)
    console.log("------")
  }

  onMessage(msg){
    msg.hear(/.*/i, match => console.log(msg.text) )
  }
}
