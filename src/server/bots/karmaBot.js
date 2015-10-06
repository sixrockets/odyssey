"use strict";

var _ = require('lodash'),
    Q = require('Q')

export default function KarmaBot(app){
  this.app = app
  this.redisClient = this.app.modules.redisClient
  this.messageParser = new (require('./karmaBot/parser')( app ))();
  this.globalCommands = ['karmaList'];
  this.userCommands = ['karmaPlus', 'karmaMinus'];
  this.allCommands = this.globalCommands + this.userCommands;
};

KarmaBot.prototype.increaseKarma = function(userName, performerId, cb){
  console.log('increasing karma for ' + userName);
  redisClient.set('karmaBot:karmaPlus' + userName, '1', 'NX', 'EX', 5)
  this.app.slackUsers.findByNameOrSlackId(userName, function(err, user){
    if ( user !== null && user.slackId != performerId ){
      user.increaseKarma(cb);
    }
  });
};

KarmaBot.prototype.decreaseKarma = function(userName, performerId, cb){
  console.log('decreasing karma for ' + userName);
  redisClient.set('karmaBot:karmaMinus' + userName, '1', 'NX', 'EX', 5)
  this.app.slackUsers.findByNameOrSlackId(userName, function(err, user){
    if ( user !== null && user.slackId != performerId ){
      user.decreaseKarma(cb);
    }
  });
};

KarmaBot.prototype.showKarma = function( channelId, cb ){
  console.log('showKarma called');
  console.log(channelId);
  redisClient.set('karmaBot:karmaList', '1', 'NX', 'EX', 10)
  let query = this.app.models.User.find().sort( [['karma', 'descending']] ).limit(5);
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
    this.app.slackClient.sendMessage(messages.join("\n"), channelId);
  }.bind(this));
};

KarmaBot.prototype.canPerformAction = function(userAction){
  var actionKey = "karmaBot:";
  if( _.contains( this.globalCommands, userAction.action) ){ actionKey += userAction.action  }
  else { actionKey += userAction.action + ":" + userAction.userName  }
  return Q.ninvoke(redisClient, 'exists', actionKey);
};


KarmaBot.prototype._tryAction = function(messageInfo, cb){

  let parsedInfo = this.messageParser.parseMessage(messageInfo),
      action = parsedInfo.action;

  if (action !== undefined ){
    this.canPerformAction(parsedInfo).done( function(notCanPerform){

      if ( notCanPerform == '0') {
        switch(action){
          case "karmaPlus":
            this.increaseKarma( parsedInfo.mentionedUserName, parsedInfo.userId, cb );
            break;
          case "karmaMinus":
            this.decreaseKarma( parsedInfo.mentionedUserName, parsedInfo.userId, cb );
            break;
          case "karmaList":
            this.showKarma( parsedInfo.channel, cb );
            break;
        }
      }
    }.bind(this), function(){ console.log("error getting from redis") } );
  }
};

KarmaBot.prototype.onEvent = function(message){
  console.log('karmabot ticked');
  this._tryAction(message, function(){
    console.log('try action callback');
  });
};
