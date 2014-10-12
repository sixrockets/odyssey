var request = require('request');

module.exports = function(app){

  var SlackClient = function(app){
    this.baseUrl = 'https://slack.com/api/';
  };

  SlackClient.getAccessToken = function(cb){
    app.redisClient.get('session-accessToken', function(err, body){
      if (body === null){
        cb(body);
      }
    });
  };

  SlackClient.prototype.performRequest = function(apiCall, method, cb){

    this.getAccessToken( function(accessToken){
      var apiCallUri = this.baseUrl + apiCall;

      request( {
        uri: apiCallUri,
        qs: { "access_token": accessToken } },
        function(error, response, body){
          cb(response, body);
        }
      )
    })

  };

  SlackClient.prototype.test = function(cb){
    this.performRequest('test', 'get', cb);
  };

  return new SlackClient(app);

}
