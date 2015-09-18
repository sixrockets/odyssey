"use strict";

class MessageFilter{

  constructor(){
  }

  call(slackMessage){
    if (slackMessage.parsedMessage.type == "message"){
      return slackMessage;
    } else {
      throw new Error("not a message");
    }
  }
}

module.exports = new MessageFilter();
