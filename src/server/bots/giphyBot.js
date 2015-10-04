import { extend, sample, map } from 'lodash';
import { get } from "request";

export default class GiphyBot {
  constructor() {
    this.name = "GiphyBot";
    this.apiCallUrl = "http://api.giphy.com/v1/gifs/search"
    this.qs = {
      api_key: process.env.GIPHY_KEY,
      limit: 50,
      offset: 0
    }
  }

  testMessage(message){
    return /^[\w\-]+\.gif$/.test(message)
  }

  getImageName(message){
    return message.substr(0, message.length-4).replace(/[-_+\s]+/g, " ").trim()
  }

  perfomRequest(query, cb){
    if (!query) return

    var qs = extend({q: query}, this.qs)
    var params = {json: true, url: this.apiCallUrl, qs: qs}
    get(params, (_e, _r, body) => body && cb(body))
  }

  onMessage(message){
    var query = this.testMessage(message.text) && this.getImageName(message.text)

    this.perfomRequest(query, body => {
      var options = map(body.data, photo => photo.url)
      if (!options[0]) return
      message.send(`${query}: ${sample(options)}`)
    })
  }
}
