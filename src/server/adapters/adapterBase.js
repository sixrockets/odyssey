import {partial} from "lodash"
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

  messagePromise(event) {
    const middlewares = this.middlewares.map(middleware =>
      partial(middleware, this).bind(middleware)
    )
    return middlewares.reduce(Q.when, Q(new Message(event)))
  }

  async onEvent(event) {
    try {
      this.emit("event", await this.messagePromise(event))
    } catch (error) {
      console.trace(error)
    }
  }
}
