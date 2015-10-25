import Q from "Q"
import sendLocationPolyfill from "../middlewares/sendLocationPolyfill"

const isMessage = ({parsedMessage}) => parsedMessage.type === "message"

const listener = app => async rawEvent => {
  try {
    const event = await app.middlewares.reduce(Q.when, Q(rawEvent))

    app.bots.forEach(bot => {
      if (bot.onEvent) bot.onEvent(event)
      if (isMessage(event) && bot.onMessage) bot.onMessage(event)
    })
  } catch (error) {
    console.trace(error)
  }
}

export default app => {
  app.middlewares = [sendLocationPolyfill]
  app.adapters.forEach(adapter => adapter.on("event", listener(app)))
}
