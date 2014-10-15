var request = require('request'),
    url     = require('url'),
    _       = require('underscore'),
    Q       = require('q');

module.exports = function(app){

  var SlackClient = function(app){
    this.baseUrl = 'https://slack.com/api/';
  };

  SlackClient.prototype.getAccessToken = function(cb){

    if (this.accessToken !== null && this.accessToken !== undefined){
      cb(null, this.accessToken);
    } else {

      app.redisClient.get('session-accessToken', function(err, accessToken){
        if (accessToken !== null){
          this.accessToken = accessToken;
          cb(null, this.accessToken);
        } else {
          cb({error: 'No accessToken found'}, {});
        }
      }.bind(this));
    }

  };


  SlackClient.prototype.performRequest = function(apiCall, method, params, cb){
    var deferred = Q.defer();
    this.getAccessToken( function(err, accessToken){
      console.log("getAccessToken resloved")
      if( err !== null ) {
        //callback
        if(cb){cb(err, {})}

        // promise
        deferred.reject(new Error(err));
      }
      else {
        var apiCallUrl = url.parse(this.baseUrl + apiCall);
        console.log("make request")
        request( {
          json:true,
          url:  apiCallUrl, qs: _.extend({ "token": accessToken }, params)},
          function(error, response, body){
            
            console.log("request resloved")
            console.log(error != null)
            console.log(response != null)
            console.log(body != null)

            var err = null;
            if(error){ err = {error: 'There was an error performing the request'}; }
            if (body['ok'] == false){ err = {error: body['error']}  };

            // callback
            if( cb ){cb(err, response, body);}

            //promise
            if( err !== null ) {
              deferred.reject(new Error(err));
            } else {
              console.log("resolve promise")
              deferred.resolve({response: response, body: body});
            }
 
          }
        )
      }
    }.bind(this))

    return deferred.promise;
  };

  SlackClient.prototype.test = function(cb){
    console.log('slack client test called');
    return this.performRequest('api.test', 'get', {}, cb);
  };

  SlackClient.prototype.channelsList = function(cb){
    return this.performRequest('channels.list', 'get', {}, cb);
  }

  SlackClient.prototype.groupsList = function(cb){
    return this.performRequest('groups.list', 'get', {}, cb);
  }

  SlackClient.prototype.chatsList = function(cb){
    var combiner = function(groups, channels){
      var channels = channels.body.channels;
      var groups = groups.body.groups;
      var result = {ok: true, chats: _.union(channels, groups)};
      if(cb){ cb(null, result) }
      return result;
    }
    return Q.spread([
      this.groupsList(),
      this.channelsList()
    ], combiner).fail(function (error) { if(cb){cb(error)} });
  }

  SlackClient.prototype.channelsHistory = function(params, cb){
    return this.performRequest('channels.history', 'get', params, cb);
  }

  SlackClient.prototype.usersList = function(cb){
    return this.performRequest('users.list', 'get', {}, cb);
  }

  SlackClient.prototype.channelsHistory = function(params, cb){
    return this.performRequest('channels.history', 'get', params, cb);
  }

  SlackClient.prototype.groupsHistory = function(params, cb){
    return this.performRequest('groups.history', 'get', params, cb);
  }

  SlackClient.prototype.chatsHistory = function(params, cb){
    var chat = params.chat;
    var params = _.extend(_.omit(params, 'chat'), {channel: chat.id});
    if (params.chat.is_channel){
      return this.channelsHistory(params, cb);
    }
    if (params.chat.is_group){
      return this.groupsHistory(params, cb);
    }
  }

  SlackClient.prototype.groupsMessages = function(params, cb){
    var deferred = Q.defer();
    this.groupsHistory(params, function(err, response, body){      
      if(err){
        //callback
        if( cb ){ cb(err) }
        //promise
        deferred.reject(new Error(err));
      }else{
        //callback
        if( cb ){ cb(null, body['messages']); }
        // promise
        deferred.resolve(body['messages']);
      }
    })
    return deferred.promise;
  }

  SlackClient.prototype.chatPostMessage = function(params, cb){
    var default_params = {
      username: "My Bot",
      icon_emoji: ":ghost:"
    }
    _.extend(default_params, params)
    return this.performRequest('chat.postMessage', 'post', default_params, cb);
  }

  return new SlackClient(app);

}
