import React from "react";
import Router from "react-router";
import routes from "../shared/routes";

let express = require('express'),
    express_session = require('express-session');

module.exports = function(app){
  let _   = app.modules._,
      Q   = app.modules.q,
      Qx  = app.modules.qx;


  let webServer = express();

  var hbs = require('express-hbs');

  // Use `.hbs` for extensions and find partials in `views/partials`.
  webServer.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/../../views/partials'
  }));
  webServer.set('view engine', 'hbs');
  webServer.set('views', __dirname + '/../../views');

  webServer.use(express_session({ secret: app.config.secret, resave: true, saveUninitialized: true }));

  webServer.get('/', function(req, res){
    console.log('hello');
    Router.run(routes, req.url, Handler => {
      let content = React.renderToString(<Handler />);
      res.render('index', { content: content });
    });
  });

  webServer.get('/users', function(req, res){
    app.slackUsers.saveUsers(function(err, body){
      res.send(body);
    })
  });


  webServer.get('/user', function(req, res){
    app.slackUsers.userInfo(req.query.id, function(err, body){
      res.send(body);
    })
  });

  webServer.get('/groupsList', function(req, res){
    var sender = function(value){
      res.send(value.body)
    }
    app.slackClient.groupsList().then(sender)
  });

  webServer.get('/channelsList', function(req, res){
    var sender = function(value){
      res.send(value.body)
    }
    app.slackClient.channelsList().then(sender)
  });


  webServer.get('/chatsList', function(req, res){
    var sender = function(value){
      res.send(value)
    }
    app.slackClient.chatsList().then(sender)
  });


  var server = webServer.listen(app.config.port, function() {    
    console.log('Listening on port %d', server.address().port);
  });

  return webServer
}
