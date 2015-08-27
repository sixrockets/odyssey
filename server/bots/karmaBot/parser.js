"use strict";

module.exports = function(BaseParser){

  class KarmaBotParser extends BaseParser{

    parseMessage(messageData){

      console.log('KarmaBotParser parsing message');

      let parsedMessage = super.parseMessage(messageData),
          action = undefined,
          userName = undefined,
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

  return KarmaBotParser;
}
