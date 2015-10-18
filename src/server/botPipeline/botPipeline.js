import { map } from "lodash"
const Q = require("Q")
const Qx = require("Qx")
const SlackMessage = require("./slackMessage")

class BotPipeline {

  constructor( ) {
    console.log("init bot pipeline")
    console.log(arguments[0])
    this.middlewares = Array.prototype.slice.call(arguments)
    this.bots = []
  }

  use( middleware ) {
    this.middlewares.push(middleware)
  }

  useBot( bot ) {
    this.bots.push(bot)
  }

  onMessage( message ) {
    const middlewareFunctions = map( this.middlewares, (middleware) => { return middleware.call.bind(middleware)} )
    const originalMessage = new SlackMessage(message)
    const pipelinedMessagePromise = middlewareFunctions.reduce(Q.when, Q(originalMessage) )

    pipelinedMessagePromise
      .then( (slackMessage) => {
        console.log("bot pipeline here")
        console.log(slackMessage)
        Qx.map(this.bots, bot => bot.onMessage && bot.onMessage(slackMessage))

      } )
      .fail( (error) => {
        console.log(error)
        console.log("pipeline ignoring message")
      } )
  }
}

module.exports = BotPipeline
