import { extend, sample, map } from 'lodash';
import { get } from "request";

class FlickrBot {
  constructor(responder) {
    this.name = "FlickrBot";
    this.apiCallUrl = "https://api.flickr.com/services/rest/";
    this.responder = responder;
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
  }

  testMessage(message){
    return /^[\w\-]+\.jpg$/.test(message)
  }

  getImageName(message){
    return message.substr(0, message.length-4).replace(/[-_+\s]+/g, " ").trim()
  }

  perfomRequest(query, cb){
    if (!query) return

    var qs = extend({text: query}, this.qs)
    var params = {json: true, url: this.apiCallUrl, qs: qs}
    get(params, (_e, _r, body) => body && cb(body))
  }

  onMessage(slackMessage){
    var message = slackMessage.parsedMessage;
    var query = this.testMessage(message.text) && this.getImageName(message.text)

    this.perfomRequest(query, body => {
      var options = map(body.photos.photo, photo => photo.url_m)
      if (!options[0]) return
      this.responder.sendMessage(`${query}: ${sample(options)}`, message.channel)
    })
  }
}

module.exports.new_bot = (app) => {
  return new FlickrBot(app.slackClient);
}
