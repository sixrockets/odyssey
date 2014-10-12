module.exports = function(){

  var Parser = function(){

  };

  Parser.prototype.parseMessage(message){

    var action = undefined;
    var user = undefined;

    // Cutre parse v1
    if ( message.match(/^@\w+\+{2}$/) ){
      action = "karmaPlus";
    } else if ( message.match(/^@\w+\-{2}$/) ){
      action = "karmaMinus";
    };

    if(action !== undefined){
      userName = message.replace("@","").replace("++", "").replace("--", "");
    }

    return {action: action, userName: userName};
  };

}
