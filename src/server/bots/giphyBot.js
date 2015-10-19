export default (_app) =>
  class GiphyBot {
    constructor() {
      this.name = "GiphyBot"
      this.apiCallUrl = "http://api.giphy.com/v1/gifs/search"
      this.qs = {
        api_key: process.env.GIPHY_KEY,
        limit: 50,
        offset: 0
      }
    }

    onMessage(msg) {
      msg.hear(/^([\w\-]+)\.gif$/, (match) => {
        const query = match[1].replace(/[-_+\s]+/g, " ").trim()
        if (!query) return
        const qs = msg.extend({q: query}, this.qs)
        const params = {json: true, url: this.apiCallUrl, qs: qs}
        msg.http.get(params, (_e, _r, body) => {
          if (!body) return
          const options = msg.map(body.data, photo => photo.url)
          if (!options[0]) return
          msg.send(`${query}: ${msg.sample(options)}`)
        })
      })
    }
  }
