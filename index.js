var app     = require('./app'),
    _       = require('underscore');


app.channel_name = /_bot_/;

app.bot = function(message, post){
  text = message["user"] + " says " + message["text"];
  console.log(text + "\n")
  post({text: text});
}

app.channels = function(cb){

  app.slackClient.groupList(function(err, response, body){
    groups = _.filter(body["groups"], function(group){ return app.channel_name.test(group["name"]) })
    app.channels_ids = _.map(groups, function(group){return group["id"]})

    _.each(app.channels_ids, function(channel){
      cb(channel)
    });

  });

}

app.get('/', function(req, res){
  var now = Date.now() / 1000;

  app.channels(function(channel){

    function post(params){
      app.slackClient.chatPostMessage(_.extend({channel:channel}, params), function(){})
    }

    app.redisClient.get('oldest', function(err, oldest){
      app.redisClient.set('oldest', now)

      var params = {
        channel: channel,
        oldest: (oldest || now - 60),
        latest: now
      };

      app.slackClient.groupsHistory(params, function(err, response, body){
        _.each(body['messages'], function(message, _index, _list){
          if (!_.has(message, 'subtype')){
            app.bot(message, post)
          }
        })
      })

    });

  });

  res.send("...");

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
