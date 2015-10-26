const isMessage = ({parsedMessage}) => parsedMessage.type === "message"

export default function botsMiddleware(event) {
  this.bots.forEach(bot => {
    if (bot.onEvent) bot.onEvent(event)
    if (isMessage(event) && bot.onMessage) bot.onMessage(event)
  })
}
