"use strict";

let _ = require('lodash');


class KarmaBotParser{

  call(slackMessage){
    console.log('parsing');

    let action = undefined,
        userName = "",
        parsedMessage = slackMessage.parsedMessage,
        message = parsedMessage.message.replace("@","").replace("<","").replace(">","");

    // Cutre parse v1
    if ( message.match(/^\w+\+{2}$/) ){
      action = "karmaPlus";
    } else if ( message.match(/^\w+\-{2}$/) ){
      action = "karmaMinus";
    } else if ( message.match(/^karmaList$/) ){
      action = "karmaList";
    };

    if(action !== undefined && action != "karmaList"){
      userName = message.replace("++", "").replace("--", "");
    }
    return _.clone(  slackMessage.newFromThis( parsedMessage, {action: action, mentionedUserName: userName}) );
  }
}

module.exports = KarmaBotParser;
