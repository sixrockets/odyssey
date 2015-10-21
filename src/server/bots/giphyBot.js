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
      msg.hear(/^([\w\-]+)\.gif$/, async match => {
        const query = match[1].replace(/[-_+\s]+/g, " ").trim()
        if (!query) return
        const {body} = await msg.http.get({
          json: true, url: this.apiCallUrl, qs: { ...this.qs, q: query }
        })
        if (!body) return
        const options = body.data.map(photo => photo.url)
        if (!options[0]) return
        msg.send(`${query}: ${msg.sample(options)}`)
      })
    }
  }
