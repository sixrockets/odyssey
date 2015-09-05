"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _sharedRoutes = require("../shared/routes");

var _sharedRoutes2 = _interopRequireDefault(_sharedRoutes);

console.log("hello from entry.js");

_reactRouter2["default"].run(_sharedRoutes2["default"], _reactRouter2["default"].HistoryLocation, function (Handler, state) {
  _react2["default"].render(_react2["default"].createElement(Handler, null), document.getElementById('react-app'));
});