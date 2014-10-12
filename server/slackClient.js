var request = require('request'),
    url     = require('url');

module.exports = function(app){

  var SlackClient = function(app){
    this.baseUrl = 'https://slack.com/api/';
  };

  SlackClient.prototype.getAccessToken = function(cb){
    console.log('getting access token');
    app.redisClient.get('session-accessToken', function(err, body){
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
        url:  url.parse(apiCallUri),
        protocol: 'https',
        qs: { "access_token": accessToken } },
        function(error, response, body){
          console.log(error);
          console.log(response);
          console.log(body);

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
