var _ = require('lodash');

module.exports = function(app, onEvent){
  var driver = {};
  driver.users = app.slackUsers = require('./slackUsers')(app);
  driver.client = app.slackClient = new app.modules.AwesomeSlack(app.config.slack_api.token);

  var fillMessage  = function(message){
    return _.extend({ device: 'slack', driver: driver }, message)
  }

  var responder = function(channel){
    return function (text) {
      app.slackClient.sendMessage(text, channel);
    };
  }

  var onMessageReceived = function (messageInfo) {
    var message = JSON.parse(messageInfo);
    onEvent(fillMessage(message), responder(message.channel))
  };

  app.slackClient.on('connectionOpen', function(){
    app.slackUsers.saveUsers();
  });
  app.slackClient.on('messageReceived', onMessageReceived);

  app.slackClient.startSocketConnection();
}
