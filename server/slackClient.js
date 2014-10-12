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
      if( err !== null ) { cb(er, {}) }
      else {
        var apiCallUrl = url.parse(this.baseUrl + apiCall);        
        request( {
          url:  apiCallUrl, qs: { "token": accessToken } },
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


  return new SlackClient(app);

}
