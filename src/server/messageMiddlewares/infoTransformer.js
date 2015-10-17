"use strict";

let _ = require('lodash');

class InfoTransformer{

  constructor(){
  }

  call( slackMessage){
    let parsedMessage = slackMessage.parsedMessage;
    let newParsedMessage = _.merge(parsedMessage, {userId: parsedMessage.user})
    return slackMessage.newFromThis( newParsedMessage );
  }
}

module.exports = new InfoTransformer();
