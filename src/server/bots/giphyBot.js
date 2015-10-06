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

  onMessage(msg){
    msg.hear(/^([\w\-]+)\.gif$/, (match) => {
      var query = match[1].replace(/[-_+\s]+/g, " ").trim()
      if (!query) return;
      var qs = msg.extend({q: query}, this.qs)
      var params = {json: true, url: this.apiCallUrl, qs: qs}
      msg.http.get(params, (_e, _r, body) => {
        if (!body) return;
        var options = msg.map(body.data, photo => photo.url)
        if (!options[0]) return;
        msg.send(`${query}: ${msg.sample(options)}`)
      })
    })
  }
}
