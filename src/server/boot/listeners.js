import Qx from "Qx"

const listener = app => event => {
  Qx.map(app.bots, bot => {
    try {
      bot.onEvent && bot.onEvent(event)
    } catch (error) {
      console.trace(error)
    }

    if(event.parsedMessage.type === "message"){
      try {
        bot.onMessage && bot.onMessage(event)
      } catch (error) {
        console.trace(error)
      }
    }
  })
}

export default app => app.adapters.map(adapter => adapter.on("event", listener(app)))

