"use strict";

let app = require('./app');
let _   = app.modules._,
    Q   = app.modules.q,
    Qx  = app.modules.qx;


app.get('/', function(req, res){
  console.log('hello');
  res.send('hello');
});


app.get('/users', function(req, res){
  app.slackUsers.saveUsers(function(err, body){
    res.send(body);
  })
});

app.get('/user', function(req, res){
  app.slackUsers.userInfo(req.query.id, function(err, body){
    res.send(body);
  })
});

app.get('/groupsList', function(req, res){
  var sender = function(value){
    res.send(value.body)
  }
  app.slackClient.groupsList().then(sender)
});

app.get('/channelsList', function(req, res){
  var sender = function(value){
    res.send(value.body)
  }
  app.slackClient.channelsList().then(sender)
});


app.get('/chatsList', function(req, res){
  var sender = function(value){
    res.send(value)
  }
  app.slackClient.chatsList().then(sender)
});


var server = app.listen(app.config.port, function() {
  app.modules.mongoose.connect(app.config.mongodb.url);
  console.log('Listening on port %d', server.address().port);
});
