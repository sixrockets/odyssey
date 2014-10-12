var express = require('express'),
    express_session = require('express-session'),
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
    console.log( "Received " + accessToken + " " + refreshToken + " " + profile);
    app.redisClient.set('session-accessToken', accessToken);
    app.redisClient.set('session-refreshToken', refreshToken);
    app.redisClient.set('session-profile', profile);
    var userSession = { accessToken: accessToken, refreshToken: refreshToken, profile: profile  };
    return done(null, userSession);
  }
));


app.use(express_session({ secret: app.config.secret }));
app.use(passport.initialize());
app.use(passport.session());



app.redisClient = require( serverPath( 'redisClient' ))(app);

module.exports = app;
