module.exports = function(app){

  var EchoBot = function(){
    this.name = "EchoBot";
  };

  EchoBot.prototype.onMessage = function(message, responder){
    responder(message.text)
  }

  return new EchoBot();
}
