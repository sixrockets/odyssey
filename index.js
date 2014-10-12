var app = require('./app');

// Only API endpoint for now
app.get('/', function(req, res){
  app.slackClient.test(function(response, body){
    console.log(response);
    console.log(body);
    res.send(response);
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
