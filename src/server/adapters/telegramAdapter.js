var rp = require('request-promise');
var _ = require('lodash');

module.exports = function(app, onEvent){
  class TelegramAdapter {
    constructor() {
      this.offset = 0;
    }

    url(action, file){
      return file
        ? `https://api.telegram.org/file/bot${app.config.telegram_api.token}/${file}`
        : `https://api.telegram.org/bot${app.config.telegram_api.token}/${action}`
    }

    command(action){
      return qs =>
        action == 'file'
          ? rp(this.url(action, qs))
          : rp({ url: this.url(action), qs: qs })
    }

    send(channel, text){
      let sender = text => this.command('sendMessage')({ chat_id: channel.id, text: text })
      return text ? sender(text) : sender
    }

    sendLocation(channel, location){
      let sender = location => this.command('sendLocation')({ chat_id: channel.id, latitude: location.lat, longitude: location.lon })
      return location ? sender(location) : sender
    }

  }

  let client = new TelegramAdapter();

  let fillMessage = message => {
    return _.extend({
      device: 'telegram',
      driver: client,
      type: 'message',
      sendLocation: client.sendLocation(message.chat)
    }, message)
  }

  let max = (arr, cb) => _.max(_.map(arr, cb))

  let updateOffset = result => {
    if (result[0]) client.offset = max(result, update => update.update_id)
  }

  let tick = () => {
    client.command('getUpdates')({offset: client.offset + 1})
      .then(message => {
        message = JSON.parse(message)

        updateOffset(message.result)

        _.map(message.result, update => {
          onEvent(fillMessage(update.message), client.send(update.message.chat))
        })

      })
      .catch(console.error);
  }

  setInterval(tick, 1000)

  return client
}
