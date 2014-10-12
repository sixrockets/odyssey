var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    request = require('request'),
    mongoose = require('mongoose'),
    underscore = require('underscore'),
    async = require('async'),
    SlackStrategy = require('passport-slack').Strategy,
    passport = require('passport'),
    config = require('./config');

var serverPath = function(route){
  return path.join(__dirname, 'server', route);
}

var app = express();

app.serverPath = serverPath;
app.use(logger());

app.config = config();

app.modules = {};
mongoose.set('debug', true);
app.modules.mongoose = mongoose;
app.modules._ = underscore;
app.modules.async = async;
app.modules.passport = passport;

passport.use(new SlackStrategy({
    clientID: app.config.slack_api.client_id,
    clientSecret: app.config.slack_api.secret
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, {});
  }
));

app.redisClient = require( serverPath( 'redisClient' ))(app);
app.bicimadFetcher = require( serverPath( 'bicimadFetcher' ))(app);
app.models = require( serverPath( path.join('models', 'index') ) )(app);

module.exports = app;
