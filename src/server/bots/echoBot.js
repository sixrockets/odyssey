module.exports = function(app){

  var EchoBot = function(){
    this.name = "EchoBot";
  };

  var internal = function(message, responder){
    responder(words)
  }

  // function simpleBot(bot){
  //   function(messageInfo){
  //     var message = JSON.parse(messageInfo);

  //     var responder = function(text){
  //       app.slackClient.sendMessage(text, message.channel);
  //     }

  //     if (message.type == "message"){
  //       bot(message, responder)
  //     }
  //   }
  // }

  // EchoBot.prototype.tick = simpleBot(internal)


  EchoBot.prototype.tick = function(messageInfo){
    var message = JSON.parse(messageInfo);

    var responder = function(text){
      app.slackClient.sendMessage(text, message.channel);
    }

    if (message.type == "message"){
      this.onMessage(message, responder)
    }
  }

  EchoBot.prototype.onMessage = internal

  return new EchoBot();
}
