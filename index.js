var app     = require('./app'),
    _       = require('underscore');


app.channel_name = /_bot_/;

app.bot = function(message, post){
  // text = "<@"+ message.user +">" + " says " + message.text;
  text = "*" + message.username + "* _says_: \n>" + message.text;
  console.log(text + "\n")
  post({
    text: text,
    username: "Echo Bot",
    icon_emoji: ":speaker:"
  });
}


app.timer = null;

app.get('/', function(req, res){

  if (app.timer !== null){ clearInterval(app.timer) };

  app.timer = setInterval( function(){
    app.slackStreamer.getLastMessages( /underground-ruby-room|baruco-2014|test/, function(err, messageInfo){
      app.karmaBot.tick(messageInfo);
    });
  }, 2500 );
  res.send("bots started");

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

app.get('/auth/slack',
  app.modules.passport.authorize('slack')
);

app.get('/auth/slack/callback',
  app.modules.passport.authorize('slack', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);


var server = app.listen(app.config.port, function() {
  // app.modules.mongoose.connect(app.config.mongodb.url);
  console.log('Listening on port %d', server.address().port);
});
