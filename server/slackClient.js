var request = require('request'),
    url     = require('url'),
    _       = require('underscore');

module.exports = function(app){

  var SlackClient = function(app){
    this.baseUrl = 'https://slack.com/api/';
  };

  SlackClient.prototype.getAccessToken = function(cb){
    console.log('getting access token');

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

    this.getAccessToken( function(err, accessToken){
      if( err !== null ) { cb(err, {}) }
      else {
        var apiCallUrl = url.parse(this.baseUrl + apiCall);
        request( {
          json:true,
          url:  apiCallUrl, qs: _.extend({ "token": accessToken }, params)},
          function(error, response, body){
            var err = null;
            if(error){ err = {error: 'There was an error performing the request'}; }
            if (body['ok'] == false){ err = {error: body['error']}  };
            cb(err, response, body);
          }
        )
      }
    }.bind(this))

  };

  SlackClient.prototype.test = function(cb){
    console.log('slack client test called');
    this.performRequest('api.test', 'get', {}, cb);
  };

  SlackClient.prototype.groupList = function(cb){
    this.performRequest('groups.list', 'get', {}, cb);
  }

  SlackClient.prototype.channelsHistory = function(params, cb){
    this.performRequest('channels.history', 'get', params, cb);
  }

  SlackClient.prototype.usersList = function(cb){
    this.performRequest('users.list', 'get', {}, cb);
  }

  var groupsHistory = SlackClient.prototype.groupsHistory = function(params, cb){
    this.performRequest('groups.history', 'get', params, cb);
  }

  SlackClient.prototype.groupsMessages = function(params, cb){
    this.groupsHistory(params, function(err, response, body){
      if(err){
        cb(err)
      }else{
        cb(null, body['messages']);
      }
    })

  }

  SlackClient.prototype.chatPostMessage = function(params, cb){
    var default_params = {
      username: "My Bot",
      icon_emoji: ":ghost:"
    }
    _.extend(default_params, params)
    this.performRequest('chat.postMessage', 'post', default_params, cb);
  }

  return new SlackClient(app);

}
