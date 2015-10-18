module.exports = (app, onEvent) => {
  const driver = {}
  driver.users = app.slackUsers = require("./slackUsers")(app)
  driver.client = app.slackClient = new app.modules.AwesomeSlack(app.config.slack_api.token)

  const fillMessage = message => {
    return { device: "slack", driver, ...message }
  }

  const responder = channel => text => {
    app.slackClient.sendMessage(text, channel)
  }

  const onMessageReceived = messageInfo => {
    const message = JSON.parse(messageInfo)
    onEvent(fillMessage(message), responder(message.channel))
  }

  app.slackClient.on("connectionOpen", () => {
    app.slackUsers.saveUsers()
  })
  app.slackClient.on("messageReceived", onMessageReceived)

  app.slackClient.startSocketConnection()
}
