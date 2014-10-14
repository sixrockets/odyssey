var app = require('./app');

var _   = app.modules._,
    Qx  = app.modules.qx;

app.timer = null;

app.get('/', function(req, res){

  if (app.timer !== null){ clearInterval(app.timer) };

  app.timer = setInterval( function(){
    app.slackStreamer.getLastMessages( app.config.channels, function(err, messageInfo){
      Qx.map(app.bots, function(bot){bot.tick(messageInfo)})
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
  app.modules.mongoose.connect(app.config.mongodb.url);
  console.log('Listening on port %d', server.address().port);
});
