
var MessageParser = require('./karmaBot/parser')();

module.exports = function(app){

  var async = app.modules.async,
      _     = app.modules._,
      Q     = app.modules.q,
      redisClient = app.redisClient;

  var KarmaBot = function(app){
    this.messageParser = new MessageParser();
    this.globalCommands = ['karmaList'];
    this.userCommands = ['karmaPlus', 'karmaMinus'];
    this.allCommands = this.globalCommands + this.userCommands;
  };

  KarmaBot.prototype.increaseKarma = function(userName, cb){
    console.log('increasing karma for ' + userName);
    redisClient.set('karmaBot:karmaPlus' + userName, '1', 'NX', 'EX', 5)
    app.slackUsers.findByName(userName, function(err, user){
      if ( user !== null ){
        user.increaseKarma(cb);
      }
    });
  };

  KarmaBot.prototype.decreaseKarma = function(userName, cb){
    console.log('decreasing karma for ' + userName);
    redisClient.set('karmaBot:karmaMinus' + userName, '1', 'NX', 'EX', 5)
    app.slackUsers.findByName(userName, function(err, user){
      if ( user !== null ){
        user.decreaseKarma(cb);
      }
    });
  };

  KarmaBot.prototype.showKarma = function( channelId, cb ){
    redisClient.set('karmaBot:karmaList', '1', 'NX', 'EX', 10)
    query = app.models.User.find().sort( [['karma', 'descending']] ).limit(5);
    query.exec(function(err, users){
      var index = 1;
      var messages = _.map(users, function(user){
        var str = "";
        var karma = 0;
        karma = (user.karma === undefined) ? 0 : user.karma;
        str = index + " " + user.name + user.name[user.name.length - 1]  + ": " + karma;
        index++;
        return str;
      });
      app.slackClient.chatPostMessage( {channel: channelId, text: messages.join("\n") }, cb );
    });
  };

  KarmaBot.prototype.canPerformAction = function(userAction){
    var actionKey = "karmaBot:";
    if( _.contains( this.globalCommands, userAction.action) ){ actionKey += userAction.action  }
    else { actionKey += userAction.action + ":" + userAction.userName  }
    return Q.ninvoke(redisClient, 'exists', actionKey);
  };


  KarmaBot.prototype._tryAction = function(messageInfo, cb){
    parsedInfo = this.messageParser.parseMessage(messageInfo.message.text);
    var action = parsedInfo.action;
    if (action !== undefined ){

      this.canPerformAction(parsedInfo).then( function(notCanPerform){
        if ( notCanPerform == '0') {

          switch(action){
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
      }.bind(this))
    }
  };

  KarmaBot.prototype.tick = function(message){
    this._tryAction(message, function(){
      console.log('karmabot ticked');
    });
  };

  return new KarmaBot(app);

}
