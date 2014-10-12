var request = require('request');

module.exports = function(app){

  var SlackClient = function(app){
    this.baseUrl = 'https://slack.com/api/';
  };

  SlackClient.prototype.getAccessToken = function(cb){
    console.log('getting access token');
    app.redisClient.get('session-accessToken', function(err, body){
      console.log('the access token is ' + body);
      if (body !== null){
        cb(body);
      }
    });
  };

  SlackClient.prototype.performRequest = function(apiCall, method, cb){

    this.getAccessToken( function(accessToken){
      console.log('sucessfully got the access token');
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
    console.log('slack client test called');
    this.performRequest('test', 'get', cb);
  };

  return new SlackClient(app);

}
