module.exports = function(){

  var Parser = function(){
  };

  Parser.prototype.parseMessage = function(message){

    var action = undefined;
    var userName = undefined;
    console.log('parsing ' + message);
    // Cutre parse v1
    if ( message.match(/^\w+\+{2}$/) ){
      action = "karmaPlus";
    } else if ( message.match(/^\w+\-{2}$/) ){
      action = "karmaMinus";
    };

    if(action !== undefined){
      console.log('action ' + action );
      userName = message.replace("@","").replace("++", "").replace("--", "");
    }

    return {action: action, userName: userName};
  };

  return Parser;

}
