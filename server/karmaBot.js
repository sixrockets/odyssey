
var MessageParser = require('./karmaBot/parser')();

module.exports = function(app){

  var async = app.modules.async,
      _     = app.modules._;


  var KarmaBot = function(app){

    this.messageParser = new MessageParser();
    console.log( this.messageParser );
    // Hardcoded right now, refactor later.
    this.monitoringChannelNames = /underground-ruby-room|other-channel/
    // this.monitoringChannels = [{"id":"G02L09CRW","name":"underground-ruby-room"}];
  };

  KarmaBot.prototype.increaseKarma = function(userName, cb){
    console.log('increasing karma for ' + userName);
    app.slackUsers.findByName(userName, function(err, user){
      if ( user !== null ){
        user.increaseKarma(cb);
      }
    });
  };

  KarmaBot.prototype.decreaseKarma = function(userName, cb){
    console.log('decreasing karma for ' + userName);
    app.slackUsers.findByName(userName, function(err, user){
      if ( user !== null ){
        user.decreaseKarma(cb);
      }
    });
  };

  KarmaBot.prototype.showKarma = function( channelId, cb ){
    query = app.models.User.find().sort( [['karma', 'descending']] ).limit(15);
    query.exec(function(err, users){
      var index = 1;
      var messages = _.map(users, function(user){
        var str = "";
        var karma = 0;
        karma = (user.karma === undefined) ? 0 : user.karma;
        str = index + " " + user.name + ": " + karma;
        index++;
        return str;
      });
      app.slackClient.chatPostMessage( {channel: channelId, text: messages.join("\n") }, cb );
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
        case "karmaList":
          this.showKarma( messageInfo.channel, cb );
          break;
      }
    }
  };

  KarmaBot.prototype.tick = function(message){
    this._tryAction(message, function(){
      console.log('karmabot ticked');
    });
  };


  return new KarmaBot(app);

}
