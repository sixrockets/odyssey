module.exports = function(){

  var _        = require('lodash'),
      request  = require('request');

  var GiphyBot = function(){
    this.apiCallUrl = "http://api.giphy.com/v1/gifs/search"
    this.qs = {
      api_key: process.env.GIPHY_KEY,
      limnit: 10,
      offset: 0
    }

  };

  GiphyBot.prototype.testMessage = function(message){
    return /^[\w\-]+\.gif$/.test(message)
  }

  GiphyBot.prototype.getImageName = function(message){
    return message.substr(0, message.length-4).replace(/[-_+\s]+/g," ").trim()
  }

  GiphyBot.prototype.perfomRequest = function(query, cb){
    var qs = _.extend({q: query}, this.qs)
    request({json: true, url: this.apiCallUrl, qs: qs}, function(error, response, body){
        if(body){
          cb(body)
        }
      }
    )
  }

  GiphyBot.prototype.onMessage = function(message, responder){
    if (!this.testMessage(message.text)) { return }

    var query = this.getImageName(message.text)

    this.perfomRequest(query, function(body){
      if(!body.data[0]) { return }

      var photo = _.sample(body.data)
      console.log("" + query + ": ", photo)
      responder("" + query + ": " + photo.url)
    })
  }

  return new GiphyBot();
}
