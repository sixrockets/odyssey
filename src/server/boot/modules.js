module.exports = (app) => {
  // ? const logger = require('morgan');
  // ? const redis = require('redis');

  app.modules = {}

  app.modules.mongoose = require("mongoose")
  app.modules._ = require("lodash")
  app.modules.async = require("async")
  app.modules.Q = require("q")
  app.modules.Qx = require("qx")
  app.modules.request = require("request")
  app.modules.AwesomeSlack = require("awesome_slack")

  app.modules.mongoose.set("debug", false)
}
