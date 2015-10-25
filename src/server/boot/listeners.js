import Q from "Q"
import sendLocationPolyfill from "../middlewares/sendLocationPolyfill"

const isMessage = ({parsedMessage}) => parsedMessage.type === "message"

const listener = app => async event => {
  try {
    event = await app.middlewares.reduce(Q.when, Q(event))

    app.bots.map(bot => {
      if (bot.onEvent) bot.onEvent(event)
      if (isMessage(event) && bot.onMessage) bot.onMessage(event)
    })
  } catch (error) {
    console.trace(error)
  }
}

export default app => {
  app.middlewares = [sendLocationPolyfill]
  app.adapters.map(adapter => adapter.on("event", listener(app)))
}
