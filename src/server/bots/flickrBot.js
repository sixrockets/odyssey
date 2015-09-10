module.exports = function(app){

  var _        = app.modules._,
      request  = app.modules.request;

  var FlickrBot = function(){
    this.name = "FlickrBot";
    this.apiCallUrl = "https://api.flickr.com/services/rest/"
    this.qs = {
      method: "flickr.photos.search",
      api_key: process.env.FLICKR_KEY,
      format: 'json',
      nojsoncallback: 1,
      sort: "relevance",
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
    return message.substr(0, message.length-4).replace(/[-_+\s]+/g," ").trim()
  }

  FlickrBot.prototype.perfomRequest = function(query, cb){
    var qs = _.extend({text: query}, this.qs)
    request({json: true, url: this.apiCallUrl, qs: qs}, function(error, response, body){
        if(body){
          cb(body)
        }
      }
    )
  }

  FlickrBot.prototype.onMessage = function(message, responder){
    if (!this.testMessage(message.text)) { return }

    var query = this.getImageName(message.text)

    this.perfomRequest(query, function(body) {
      if(!body.photos.photo[0]) { return }

      var photo = _.sample(body.photos.photo)
      console.log("" + query + ": ", photo)
      responder("" + query + ": " + photo.url_m)
    })
  }

  return new FlickrBot();
}
