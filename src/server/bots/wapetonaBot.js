export default class WapetonaBot {
  constructor() {
    this.name = "WapetonaBot"
  }

  onMessage(message) {

    message.hear(/(\W|^)(holi)(\W|$)/i, _match => {
      console.log(message.text)
      message.send(message.sample(["Holii!!", "Holi", "Holi", "Morning!"]))
    })

    message.hear(/^\/cat/i, _match => {
      message.http.get("http://thecatapi.com/api/images/get?format=src", (err, httpRes, _body) => {
        message.send(httpRes.headers.location)
      })
    })

    message.hear(/.*/i, _match => {
      console.log(message.text)
    })

  }
}
