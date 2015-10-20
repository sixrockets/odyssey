export default (_app) =>
  class FlickrBot {
    constructor() {
      this.name = "FlickrBot"
      this.apiCallUrl = "https://api.flickr.com/services/rest/"
      this.qs = {
        method: "flickr.photos.search",
        api_key: process.env.FLICKR_KEY,
        format: "json",
        nojsoncallback: 1,
        sort: "relevance",
        privacy_filter: 1, // public
        content_type: 1, // photos only (no screenshots)
        media: "photos",
        extras: "url_z,url_n,url_m,url_l",
        per_page: 10
      }
    }

    onMessage(msg) {
      msg.hear(/^([\w\-]+)\.jpg$/, (match) => {
        const query = match[1].replace(/[-_+\s]+/g, " ").trim()
        if (!query) return
        const qs = msg.extend({text: query}, this.qs)
        const params = {json: true, url: this.apiCallUrl, qs: qs}
        msg.http.get(params, (_e, _r, body) => {
          if (!body) return
          const options = msg.map(body.photos.photo, photo => photo.url_m)
          if (!options[0]) return
          msg.send(`${query}: ${msg.sample(options)}`)
        })
      })
    }
  }
