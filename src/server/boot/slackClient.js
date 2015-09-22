module.exports = (app) => {
  let streamToBots = function(messageInfo){
    console.log('streamToBots');
    app.botPipeline.onMessage(messageInfo);
  };

  app.slackClient = new app.modules.AwesomeSlack(app.config.slack_api.token);

  app.slackClient.on('connectionOpen', () => {
    app.slackUsers.saveUsers();
  });
  app.slackClient.on('messageReceived', streamToBots);

}
