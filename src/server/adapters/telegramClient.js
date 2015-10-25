import rp from "request-promise"
import { max } from "lodash"

const EventEmitter = require('events')

export default class TelegramAdapter extends EventEmitter {
  constructor(apiToken) {
    super()
    this.apiToken = apiToken
    this.offset = 0
  }

  start(){
    setInterval(this.tick.bind(this), 1000)
  }

  url(action, file) {
    return file
      ? `https://api.telegram.org/file/bot${this.apiToken}/${file}`
      : `https://api.telegram.org/bot${this.apiToken}/${action}`
  }

  command(action) {
    return qs => {
      if (action === "file") return rp( this.url(action, qs) )
      return rp( { url: this.url(action), qs: qs } )
    }
  }

  async send(id, text) {
    await this.command("sendMessage")({ chat_id: id, text: text })
    console.log("after send")
  }

  async sendLocation(id, location) {
    const sender = ({lat, lon}) => this._sendLocation({ chat_id: id, latitude: lat, longitude: lon })
    return (location ? await sender(location) : await sender)
  }

  updateOffset(result){
    if (result[0]) this.offset = max(result.map(update => update.update_id))
  }

  async tick(){
    try {
      const response = await this._getUpdates({offset: this.offset + 1})
      const {result} = JSON.parse(response)
      this.updateOffset(result)
      result.map(({message}) =>{
        this.emit('messageReceived', message)
      })
    } catch (error) {
      console.log('error on tick')
      console.error(error)
    }
  }

  get _sendLocation() {
    return this.command("sendLocation")
  }

  get _getUpdates() {
    return this.command("getUpdates")
  }

}
