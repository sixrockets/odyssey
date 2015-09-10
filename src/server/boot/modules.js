"use strict";

module.exports = (app) => {


  let logger = require('morgan'),
      request = require('request'),
      mongoose = require('mongoose'),
      _ = require('lodash'),
      async = require('async'),
      Q = require('q'),
      Qx = require('qx'),
      AwesomeSlack = require('awesome_slack'),
      redis = require('redis');

  app.modules = {};
  mongoose.set('debug', false);
  app.modules.mongoose = mongoose;
  app.modules._ = _;
  app.modules.async = async;
  app.modules.Q = Q;
  app.modules.Qx = Qx;
  app.modules.request = request;
  app.modules.AwesomeSlack = AwesomeSlack;

}
