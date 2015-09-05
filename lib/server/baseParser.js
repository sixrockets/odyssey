"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  var BaseParser = (function () {
    function BaseParser() {
      _classCallCheck(this, BaseParser);
    }

    _createClass(BaseParser, [{
      key: "parseMessage",
      value: function parseMessage(messageData) {
        console.log('parsing new message');
        console.log(messageData);
        var jsonMessage = JSON.parse(messageData);
        console.log(jsonMessage.type);
        if (jsonMessage["type"] == "message") {
          console.log('is message');
          // {"type":"message","channel":"G02AYQUC5","user":"U02AL5SGC","text":"karmaList","ts":"1440513466.000011","team":"T02AKCSRF"}
          return { message: jsonMessage.text, channel: jsonMessage.channel, userId: jsonMessage.user };
        } else {
          return null;
        }
      }
    }]);

    return BaseParser;
  })();

  return BaseParser;
};