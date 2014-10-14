var _        = require('underscore'),
    request  = require('request');

module.exports = function(app){
  var FlickrBot = function(app){
    this.apiCallUrl = "https://api.flickr.com/services/rest/"
    this.qs = {
      method: "flickr.photos.search",
      api_key: process.env.FLICKR_KEY,
      format: 'json',
      nojsoncallback: 1,
      
      sort: "date-posted-desc",
      privacy_filter: 1, //public
      content_type: 1, //photos only (no screenshots)
      media: "photos",
      extras: "url_z,url_n,url_m,url_l",
      per_page: 10
    }

  };

  FlickrBot.prototype.testMessage = function(message){
    return /^[\w\-]+\.jpg$/.test(message)
  }

  FlickrBot.prototype.getImageName = function(message){
    return message.substr(0, message.length-4).replace(/-/g," ")
  }

  FlickrBot.prototype.perfomRequest = function(query, cb){
    var qs = _.extend({text: query}, this.qs)
    request({json: true, url: this.apiCallUrl, qs: qs}, function(error, response, body){
        console.log("" + query + ":")
        console.log(body)
        if(body){
          cb(body)
        }
      }
    )
  }

  FlickrBot.prototype.postPhoto = function(channel, photo){
    app.slackClient.chatPostMessage({
      channel: channel,
      text: photo,
      username: "FlickrBot",
      icon_emoji: null,
      icon_url: "http://c1345842.cdn.cloudfiles.rackspacecloud.com/assets/cdn_files/assets/000/010/337/original.png?1406912353"
    }, function(){})    
  }

  FlickrBot.prototype.parseMessage = function(message, cb){
    console.log("message" + JSON.stringify(message))
    if (this.testMessage(message.message.text)){
      var query = this.getImageName(message.message.text)
      this.perfomRequest(query, function(body){
        if(body.photos.photo[0]){
          var photo = _.sample(body.photos.photo)
          console.log(photo)
          this.postPhoto(message.channel, "" + query + ": " + photo.url_m)
        };
      }.bind(this))
    }
  }

  FlickrBot.prototype.tick = function(message){
    this.parseMessage(message)
  };

  return new FlickrBot(app);

}
