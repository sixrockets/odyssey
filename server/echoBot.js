var _        = require('underscore'),
    request  = require('request');


module.exports = function(app){
  var EchoBot = function(app){
  };

  EchoBot.prototype.tick = function(messageInfo){
    var message = messageInfo.message;
    var channel = messageInfo.channel;
    // text = "<@"+ message.user +">" + " says " + message.text;
    text = "*" + message.username + "* _says_: \n>" + message.text;
    console.log(text + "\n")
    app.slackClient.chatPostMessage({
      channel: channel,
      text: text,
      username: "Echo Bot",
      icon_emoji: ":speaker:"
    }, function(){});
  }

  return new EchoBot(app);
}
