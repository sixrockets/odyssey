"use strict";

let app = require('./app');
let _   = app.modules._,
    Q   = app.modules.q,
    Qx  = app.modules.qx;

import React from "react";
import Router from "react-router";
import routes from "../shared/routes";

app.webClient.get('/', function(req, res){
  console.log('hello');
  Router.run(routes, req.url, Handler => {
    let content = React.renderToString(<Handler />);
    res.render('index', { content: content });
  });
});

app.webClient.get('/users', function(req, res){
  app.slackUsers.saveUsers(function(err, body){
    res.send(body);
  })
});


app.webClient.get('/user', function(req, res){
  app.slackUsers.userInfo(req.query.id, function(err, body){
    res.send(body);
  })
});

app.webClient.get('/groupsList', function(req, res){
  var sender = function(value){
    res.send(value.body)
  }
  app.slackClient.groupsList().then(sender)
});

app.webClient.get('/channelsList', function(req, res){
  var sender = function(value){
    res.send(value.body)
  }
  app.slackClient.channelsList().then(sender)
});


app.webClient.get('/chatsList', function(req, res){
  var sender = function(value){
    res.send(value)
  }
  app.slackClient.chatsList().then(sender)
});


var server = app.webClient.listen(app.config.port, function() {
  app.modules.mongoose.connect(app.config.mongodb.url);
  console.log('Listening on port %d', server.address().port);
});
