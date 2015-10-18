import { extend, sample, map } from "lodash"
import { get } from "request"

module.exports = (_app) => {

  class GiphyBot {
    constructor(responder) {
      this.name = "GiphyBot"
      this.apiCallUrl = "http://api.giphy.com/v1/gifs/search"
      this.responder = responder
      this.qs = {
        api_key: process.env.GIPHY_KEY,
        limit: 50,
        offset: 0
      }
    }

    testMessage(message) {
      return /^[\w\-]+\.gif$/.test(message)
    }

    getImageName(message) {
      return message.substr(0, message.length - 4).replace(/[-_+\s]+/g, " ").trim()
    }

    perfomRequest(query, cb) {
      if (!query) return

      const qs = extend({q: query}, this.qs)
      const params = {json: true, url: this.apiCallUrl, qs: qs}
      get(params, (_e, _r, body) => body && cb(body))
    }

    onMessage(message) {
      const query = this.testMessage(message.text) && this.getImageName(message.text)

      this.perfomRequest(query, body => {
        const options = map(body.data, photo => photo.url)
        if (!options[0]) return
        message.send(`${query}: ${sample(options)}`)
      })
    }
  }

  return GiphyBot
}
