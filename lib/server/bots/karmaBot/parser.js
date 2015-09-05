"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (BaseParser) {
  var KarmaBotParser = (function (_BaseParser) {
    _inherits(KarmaBotParser, _BaseParser);

    function KarmaBotParser() {
      _classCallCheck(this, KarmaBotParser);

      _get(Object.getPrototypeOf(KarmaBotParser.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(KarmaBotParser, [{
      key: "parseMessage",
      value: function parseMessage(messageData) {

        console.log('KarmaBotParser parsing message');

        var parsedMessage = _get(Object.getPrototypeOf(KarmaBotParser.prototype), "parseMessage", this).call(this, messageData),
            action = undefined,
            userName = undefined,
            message = parsedMessage.message.replace("@", "").replace("<", "").replace(">", "");

        // Cutre parse v1
        if (message.match(/^\w+\+{2}$/)) {
          action = "karmaPlus";
        } else if (message.match(/^\w+\-{2}$/)) {
          action = "karmaMinus";
        } else if (message.match(/^karmaList$/)) {
          action = "karmaList";
        };

        if (action !== undefined && action != "karmaList") {
          userName = message.replace("++", "").replace("--", "");
        }

        return _.extend(parsedMessage, { action: action, mentionedUserName: userName });
      }
    }]);

    return KarmaBotParser;
  })(BaseParser);

  return KarmaBotParser;
};