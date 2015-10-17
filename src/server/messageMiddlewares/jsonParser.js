"use strict";


class JsonParser{

  constructor(){
  }

  call( slackMessage){
    return slackMessage.newFromThis( JSON.parse( slackMessage.originalMessage ) );
  }
}

module.exports = new JsonParser();
