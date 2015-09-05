"use strict";

module.exports = function(){

  class BaseParser{

    constructor(){
    }

    parseMessage(messageData){
      console.log('parsing new message');
      console.log(messageData);
      let jsonMessage = JSON.parse(messageData);
      console.log( jsonMessage.type );
      if(jsonMessage["type"] == "message"){
        console.log('is message');
        // {"type":"message","channel":"G02AYQUC5","user":"U02AL5SGC","text":"karmaList","ts":"1440513466.000011","team":"T02AKCSRF"}
        return { message: jsonMessage.text, channel: jsonMessage.channel, userId: jsonMessage.user };
      } else{
        return null;
      }
    }
  }

  return BaseParser;

}
