var async = app.modules.async,
    MessageParser = require('karmaBot/parser');

module.exports = function(app){

  var KarmaBot = function(app){
    this.tickThreshold = app.config.karmaBot.tickThreshold;
    this.messageParser = MessageParser.new();
    // Hardcoded right now, refactor later.
    this.monitoringChannels = [{"id":"G02L09CRW","name":"underground-ruby-room"}];
  };

  KarmaBot.prototype.start = function(){
    this.timer = setInterval( this.tick, this.tickThreshold );
  };

  KarmaBot.prototype.stop = function(){
    clearInterval(this.timer);
  };

  KarmaBot.prototype.increaseKarma = function(userName, cb){
    app.models.User.findOne( {name: userName}, function(err, user){
      if ( user !== null ){
        user.increaseKarma(cb);
      }
    });
  };

  KarmaBot.prototype.decreaseKarma = function(userName, cb){
    app.models.User.findOne( {name: userName}, function(err, user){
      if ( user !== null ){
        user.decreaseKarma(cb);
      }
    });
  };

  KarmaBot.prototype._tryAction = function(message, cb){
    parsedInfo = this.messageParser.parseMessage(message);
    if (parsedInfo['action'] !== undefined ){

      switch(parsedInfo['action']){
        case "karmaPlus":
          this.increaseKarma( parsedInfo.userName, cb );
          break;
        case "karmaMinus":
          this.decreaseKarma( parsedInfo.userName, cb );
          break;
      }
    }
  };

  KarmaBot.prototype.tick = function(){
    app.slackClient.getLastStream( function(err, messages){

      async.each(messages, this._tryAction );

    });
  };

}
