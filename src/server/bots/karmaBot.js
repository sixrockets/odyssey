"use strict";

let async = require('async'),
    _     = require('lodash'),
    Q     = require('Q'),
    SlackMessage = require('../botPipeline/slackMessage'),
    MessageParser = require('./karmaBot/parser');


module.exports = (app) => {

  class KarmaBot {

    constructor(){
      this.name = this.botName;
      this.slackUsers = app.slackUsers;
      this.slackClient = app.slackClient;
      this.redisClient = app.redisClient;
      this.messageParser = new MessageParser();
      this.globalCommands = ['karmaList'];
      this.userCommands = ['karmaPlus', 'karmaMinus'];
      this.allCommands = this.globalCommands + this.userCommands;
    }

    increaseKarma(userName, performerId, cb){
      console.log('increasing karma for ' + userName);
      this.redisClient.set('karmaBot:karmaPlus' + userName, '1', 'NX', 'EX', 5)
      this.slackUsers.findByNameOrSlackId(userName, function(err, user){
        if ( user !== null && user.slackId != performerId ){
          user.increaseKarma(cb);
        }
      });
    }

    decreaseKarma(userName, performerId, cb){
      console.log('decreasing karma for ' + userName);
      this.redisClient.set('karmaBot:karmaMinus' + userName, '1', 'NX', 'EX', 5)
      this.slackUsers.findByNameOrSlackId(userName, function(err, user){
        if ( user !== null && user.slackId != performerId ){
          user.decreaseKarma(cb);
        }
      });
    }

    showKarma( responder, cb ){
      this.redisClient.set('karmaBot:karmaList', '1', 'NX', 'EX', 10)
      let query = this.slackUsers.model().find().sort( [['karma', 'descending']] ).limit(5);
      query.exec((err, users) => {
        var index = 1;        
        var messages = _.map(users, function(user){
          var str = "";
          var karma = 0;
          karma = (user.karma === undefined) ? 0 : user.karma;
          str = index + " " + user.name + user.name[user.name.length - 1]  + ": " + karma;
          index++;
          return str;
        });

        responder(messages.join("\n"));
      });
    }

    canPerformAction(userAction){
      var actionKey = "karmaBot:";
      if( _.contains( this.globalCommands, userAction.action) ){ actionKey += userAction.action  }
      else { actionKey += userAction.action + ":" + userAction.userName  }
      return Q.ninvoke(this.redisClient, 'exists', actionKey);
    }


    _tryAction(message, cb){
      let slackMessage = new SlackMessage(message, message);
      let parsedInfo = this.messageParser.call(slackMessage).parsedMessage,
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
                this.showKarma( message.send , cb );
                break;
            }
          }
        }.bind(this), function(){ console.log("error getting from redis") } );
      }
    }

    onMessage(message){
      this._tryAction(message, function(){
        console.log('try action callback');
      });
    }
  }

  return KarmaBot;
}
