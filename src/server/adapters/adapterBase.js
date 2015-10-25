import _ from "lodash"
import Q from "Q"
import Message from "./message"
import EventEmitter from "events"

export default class AdapterBase extends EventEmitter {
  constructor( options ) {
    super()
    this.middlewares = options.middlewares
    this.driver = options.driver
  }

  use( middleware ) {
    this.middlewares.push(middleware)
  }

  async onEvent( originalMessage ) {
    try{
      const middlewareFunctions = this.middlewares.map( middleware =>
         _.partial(middleware.call, this).bind(middleware)
      )
      const message = new Message(originalMessage)
      const pipelinedMessagePromise = middlewareFunctions.reduce(Q.when, Q(message))

      const event = await pipelinedMessagePromise
      this.emit("event", event)
    } catch (error) {
      console.trace(error)
    }

  }
}
