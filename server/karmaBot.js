
var MessageParser = require('./karmaBot/parser')();

module.exports = function(app){

  var async = app.modules.async;

  var KarmaBot = function(app){

    this.messageParser = new MessageParser();
    console.log( this.messageParser );
    // Hardcoded right now, refactor later.
    this.monitoringChannelNames = /underground-ruby-room|other-channel/
    // this.monitoringChannels = [{"id":"G02L09CRW","name":"underground-ruby-room"}];
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

  KarmaBot.prototype._tryAction = function(messageInfo, cb){
    console.log('trying to parse');
    console.log(messageInfo);
    parsedInfo = this.messageParser.parseMessage(messageInfo.message.text);
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

  KarmaBot.prototype.tick = function(message){
    this._tryAction(message, function(){
      console.log('karmabot ticked');
    });
  };

  KarmaBot.prototype._monitoringChannels = function(cb){
    app.slackClient.groupList(function(err, response, body){
      groups = _.filter(body["groups"], function(group){
        return this.monitoringChannelNames.test(group["name"])
      }.bind(this));

      var channels_ids = _.map(groups, function(group){return group["id"]})

      cb( channels_ids )

    }.bind(this) );
  };

  return new KarmaBot(app);

}
