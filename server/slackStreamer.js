var _ = require('underscore');

module.exports = function(app){

  var SlackStreamer = function(app){

  };

  SlackStreamer.prototype.getLastChangedAt = function(cb){
    app.redisClient.get('oldestChangedAt', function(err, oldest){
      cb(oldest);
    })
  };

  var getChannelMessages = function(params, cb){
    console.log('getting channel messages');
    app.slackClient.groupsHistory(params, function(err, response, body){
      console.log('got channel messages');
      _.each(body['messages'], function(message, _index, _list){
        if (!_.has(message, 'subtype')){
          app.slackUsers.userInfo(message.user, function(err, userInfo){
            if (userInfo !== undefined){
              message.username = userInfo.real_name;
              _.extend(message, userInfo);
              console.log(message);
              cb(null, {channel: params.channel, message: message});
            }
          });
        }
      });
    });
  };

  SlackStreamer.prototype.getLastMessages = function(channelMatches, cb){
    this.getLastChangedAt( function(oldest){
      var now = Date.now() / 1000;
      app.redisClient.set('oldestChangedAt', now);
      app.slackClient.groupList( function(err, response, body){
        console.log('in get groupList');
        var monitoringGroups = _.filter(body["groups"], function(group){ return channelMatches.test(group["name"]) });
        console.log('fetched monitoringGroups');
        _.each(monitoringGroups, function(group) {  getChannelMessages({channel: group['id'], oldest: oldest }, cb) } );

      }.bind(this) );

    }.bind(this));
  };

  return new SlackStreamer(app);

}
