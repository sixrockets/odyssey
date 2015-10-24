const _ = require("lodash")
const Q = require("Q")
const Qx = require("Qx")
const Message = require("./message")

export default class AdapterBase {

  constructor( options ) {
    this.middlewares = options.middlewares
    this.bots = options.bots
    this.driver = options.driver
  }

  use( middleware ) {
    this.middlewares.push(middleware)
  }

  useBot( bot ) {
    this.bots.push(bot)
  }

  onEvent( originalMessage ) {
    const self = this
    const middlewareFunctions = _.map( this.middlewares, (middleware) => {
      const partialFunc = _.partial( middleware['call'], self )
      return partialFunc.bind(middleware)
    })
    const message = new Message(originalMessage)
    const pipelinedMessagePromise = middlewareFunctions.reduce(Q.when, Q(message) )

    pipelinedMessagePromise
      .then( (event) => {
        console.log("bot pipeline here")
        console.log(originalMessage)
        Qx.map(this.bots, (bot) => {
          console.log(`${bot.name} onEvent`)
          try {
            bot.onEvent && bot.onEvent(message)
          } catch (e) {
            console.log(`${bot.name} onEvent ${error}` )
            console.log(e)
          }
          if(event.parsedMessage.type === "message"){
            console.log(`${bot.name} onMessage`)
            try {
              bot.onMessage && bot.onMessage(message)
            } catch (e) {
              console.log(`${bot.name} onMessage ${error}` )
              console.log(e)
            }                        
          }
        })
      })
      .fail( (error) => {
        console.log(error)
        console.log("pipeline ignoring message")
      } )
  }

}
