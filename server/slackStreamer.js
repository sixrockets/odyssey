var _ = require('underscore');

module.exports = function(app){

  var SlackStreamer = function(app){

  };

  SlackStreamer.prototype.getLastChangedAt = function(cb){
    app.redisClient.get('oldestChangedAt', function(err, oldest){
      cb(oldest);
    })

  };

  SlackStreamer.prototype.getLastMessages = function(channelMatches, cb){
    this.getLastChangedAt( function(oldest){

      app.slackClient.groupList( function(err, response, body){

        var monitoringGroups = _.filter(body["groups"], function(group){ return channelMatches.test(group["name"]) })


      }.bind(this) )


    }.bind(this));
  };

}
