"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _sharedRoutes = require("../shared/routes");

var _sharedRoutes2 = _interopRequireDefault(_sharedRoutes);

var app = require('./app');
var _ = app.modules._,
    Q = app.modules.q,
    Qx = app.modules.qx;

app.get('/', function (req, res) {
  console.log('hello');
  _reactRouter2["default"].run(_sharedRoutes2["default"], req.url, function (Handler) {
    var content = _react2["default"].renderToString(_react2["default"].createElement(Handler, null));
    res.render('index', { content: content });
  });
});

app.get('/users', function (req, res) {
  app.slackUsers.saveUsers(function (err, body) {
    res.send(body);
  });
});

app.get('/user', function (req, res) {
  app.slackUsers.userInfo(req.query.id, function (err, body) {
    res.send(body);
  });
});

app.get('/groupsList', function (req, res) {
  var sender = function sender(value) {
    res.send(value.body);
  };
  app.slackClient.groupsList().then(sender);
});

app.get('/channelsList', function (req, res) {
  var sender = function sender(value) {
    res.send(value.body);
  };
  app.slackClient.channelsList().then(sender);
});

app.get('/chatsList', function (req, res) {
  var sender = function sender(value) {
    res.send(value);
  };
  app.slackClient.chatsList().then(sender);
});

var server = app.listen(app.config.port, function () {
  app.modules.mongoose.connect(app.config.mongodb.url);
  console.log('Listening on port %d', server.address().port);
});