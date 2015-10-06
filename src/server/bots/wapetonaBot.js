import { get } from "request";

export default class WapetonaBot {
  constructor() {
    this.name = "WapetonaBot";
  }

  onMessage(message){

    message.hear(/(\W|^)(holi)(\W|$)/i, (match) => {
      console.log(message.text)
      message.send(message.sample(["Holii!!", "Holi", "Holi", "Morning!"]))
    })

    message.hear(/^\/cat/i, (match) => {
      message.http.get('http://thecatapi.com/api/images/get?format=src', (err, http_res, body) => {
        message.send(http_res.headers.location)
      })
    })

    message.hear(/.*/i, (match) => {
      console.log(message.text)
    })

  }
}






