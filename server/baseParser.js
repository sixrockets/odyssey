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
        return jsonMessage["text"];
      } else{
        return null;
      }
    }
  }

  return BaseParser;

}
