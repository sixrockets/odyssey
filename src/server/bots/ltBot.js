module.exports = function(){

  var _ = require("lodash"),
      request = require("request"),
      parseString = require('xml2js').parseString;

  var LTBot = function(){
    this.name = "LTBot";
  };

  var simplfyResult = function(obj){
    var $ = obj.$;
    return {
      rule: $.ruleId,
      repl: $.replacements.split("#")[0],
      offset: parseInt($.offset, 10),
      errorlength: parseInt($.errorlength, 10),
      }
  }

  var substitute = function(original, init, length, replacement){
    return original.substring(0, init) + replacement + original.substring(init + length, original.length);
  }

  var replacer = function(result, other) { return substitute(result, other.offset, other.errorlength, other.repl); }

  var check = function(user_message, cb){
    request.post({url:'https://languagetool.org:8081', form: {'language':'es', 'text': user_message} },
      function(error, response, body){
        parseString(body, function (err, result) {
          if(!result) { return }
          result = _(result.matches.error).
            map(simplfyResult).
            filter('rule', 'MORFOLOGIK_RULE_ES').
            value()
          if (result.length > 0)
            cb(_.reduceRight(result, replacer, user_message) + "*");
        })
    });
  }

  LTBot.prototype.onMessage = function(message, responder){
    check(message.text, responder)
  }

  return new LTBot();

}
