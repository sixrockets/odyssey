var _        = require('underscore'),
    request  = require('request');


module.exports = function(app){
  var GiphyBot = function(app){
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
    return message.substr(0, message.length-4).replace(/-/g,"+")
  }

  GiphyBot.prototype.perfomRequest = function(query, cb){
    var qs = _.extend({q: query}, this.qs)
    console.log( "qs:" + JSON.stringify(qs))
    request({json: true, url: this.apiCallUrl, qs: qs}, function(error, response, body){
        console.log("" + query + ":")
        console.log(body)
        if(body){
          cb(body)
        }
      }
    )
  }

  GiphyBot.prototype.postPhoto = function(channel, photo){
    app.slackClient.chatPostMessage({
      channel: channel,
      text: photo,
      username: "GiphyBot",
      icon_emoji: null,
      icon_url: "http://giphy.com/static/img/giphy_logo_sm.png"
    }, function(){})    
  }

  GiphyBot.prototype.parseMessage = function(message, cb){
    console.log("message" + JSON.stringify(message))
    if (this.testMessage(message.message.text)){
      var query = this.getImageName(message.message.text)
      this.perfomRequest(query, function(body){
        if(body.data[0]){
          var photo = _.sample(body.data)
          console.log(photo)
          this.postPhoto(message.channel, "" + query + ": " + photo.url)
        };
      }.bind(this))
    }
  }

  GiphyBot.prototype.tick = function(message){
    this.parseMessage(message)
  };

  return new GiphyBot(app);

}
