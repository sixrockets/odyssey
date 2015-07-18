var express = require('express'),
    express_session = require('express-session'),
    path = require('path'),
    logger = require('morgan'),
    request = require('request'),
    mongoose = require('mongoose'),
    _ = underscore = require('lodash'),
    async = require('async'),
    config = require('./config'),
    q = require('q'),
    qx = require('qx'),
    AwesomeSlack = require('awesome_slack');

var serverPath = function(route){
  return path.join(__dirname, 'server', route);
}

var app = express();

app.serverPath = serverPath;

app.config = config();

app.modules = {};
mongoose.set('debug', true);
app.modules.mongoose = mongoose;
app.modules._ = underscore;
app.modules.async = async;
app.modules.q = q;
app.modules.qx = qx;
app.modules.request = request;
app.modules.AwesomeSlack = AwesomeSlack;
app.modules.BaseParser = require(serverPath('baseParser'))(app);

app.use(express_session({ secret: app.config.secret, resave: true, saveUninitialized: true }));

app.models = require( serverPath( path.join('models', 'index') ) )(app);

app.redisClient = require( serverPath( 'redisClient' ))(app);
app.AwesomeSlack = AwesomeSlack;
// app.slackStreamer = require(serverPath('slackStreamer'))(app);
// app.slackUsers = require(serverPath('slackUsers'))(app);

app.bots = _.map(app.config.bots, function(botName){return require( serverPath(`bots/${botName}`) )(app)})

module.exports = app;
