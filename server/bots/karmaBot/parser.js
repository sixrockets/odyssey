"use strict";

module.exports = function(BaseParser){

  class KarmaBotParser extends BaseParser{

    parseMessage(messageData){

      console.log('KarmaBotParser parsing message');

      let message = super.parseMessage(messageData);


      let action = undefined,
          userName = undefined;

      console.log('parsing ' + message);
      console.log('hello');
      // Cutre parse v1
      if ( message.match(/^\w+\+{2}$/) ){
        action = "karmaPlus";
      } else if ( message.match(/^\w+\-{2}$/) ){
        action = "karmaMinus";
      } else if ( message.match(/karmaList/) ){
        action = "karmaList";
      };

      if(action !== undefined && action != "karmaList"){
        console.log('action ' + action );
        userName = message.replace("@","").replace("++", "").replace("--", "");
      }

      return {action: action, userName: userName};
    }
  }

  return KarmaBotParser;
}
