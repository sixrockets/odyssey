module.exports = function(app){

  var _ = app.modules._;

  var SlackStreamer = function(app){

  };

  var getLastChangedAt = function( groupId, cb){
    app.redisClient.get('group:' + groupId + ':oldestChangedAt', function(err, oldest){
      cb(oldest);
    })
  };


  var getMessageInfo = function(channel, cb, message){
    if (!_.has(message, 'subtype')){
      app.slackUsers.userInfo(message.user, function(err, userInfo){
        if (userInfo !== undefined && userInfo !== null){
          message.username = userInfo.real_name;
          _.extend(message, userInfo);
          console.log(message);
          cb(null, {channel: channel, message: message});
        }
      });
    }
  };

  var getChannelMessages = function(params, cb){
    console.log('getting channel messages');
    console.log(params);
    getLastChangedAt( params.channelId, function(oldest){
      if (oldest !== null) params.oldest = oldest;

      app.slackClient.groupsHistory(params, function(err, response, body){
        console.log('got channel messages');
        // console.log(err);
        // console.log(response);
        // console.log(body);

        if (body['messages'].length > 0 ){
          var bindedGetMessageInfo = _.partial(getMessageInfo, params.channel, cb);
          _.each(body['messages'], bindedGetMessageInfo);

          var oldestMessage = _.max(body['messages'], function(message){ return parseFloat(message.ts) });
          app.redisClient.set('group:' + params.channeldId + ':oldestChangedAt', oldestMessage.ts);
        }

      });

    });


  };

  SlackStreamer.prototype.getLastMessages = function(channelMatches, cb){

      app.slackClient.groupsList( function(err, response, body){
        console.log('in get groupsList');
        var monitoringGroups = _.filter(body["groups"], function(group){ return channelMatches.test(group["name"]) });
        console.log('fetched monitoringGroups');
        _.each(monitoringGroups, function(group) {  getChannelMessages({channel: group['id']}, cb) } );

      }.bind(this) );

  };

  return new SlackStreamer(app);

}
