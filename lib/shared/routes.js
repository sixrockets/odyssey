"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reactRouter = require("react-router");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsAppController = require("./components/appController");

var _componentsAppController2 = _interopRequireDefault(_componentsAppController);

debugger;

console.log("routes js ");

exports["default"] = _react2["default"].createElement(_reactRouter.Route, { handler: _componentsAppController2["default"], path: "/" });
module.exports = exports["default"];