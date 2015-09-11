"use strict";

let BaseParser = require('../baseParser'),
    _          = require('lodash');

class KarmaBotParser extends BaseParser{

  parseMessage(messageData){
    console.log('parsing');
    let parsedMessage = super.parseMessage(messageData),
        action = undefined,
        userName = "",
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

    return _.extend( parsedMessage, {action: action, mentionedUserName: userName} );
  }
}

module.exports = KarmaBotParser;
