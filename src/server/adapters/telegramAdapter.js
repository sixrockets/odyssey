var request = require('request-promise');
var _ = require('lodash');

module.exports = function(app, onEvent){
  let offset = 0;

  let fillMessage  = function(message){
    return _.extend({device: 'telegram', driver: {}, type: 'message'}, message)
  }

  let call = action => function (qs) {
    let url = `https://api.telegram.org/bot${app.config.telegram_api.token}/${action}`
    return request({ url: url, qs: qs })
  }

  let sendMessage = channel => text => call('sendMessage')({ chat_id: channel, text: text })

  let max = (arr, cb) => _.max(_.map(arr, cb))

  let updateOffset = function(result){
    if (result[0]) offset = max(result, update => update.update_id)
  }

  let tick = function(){
    call('getUpdates')({offset: offset + 1})
      .then(function(message){
        message = JSON.parse(message)

        updateOffset(message.result)

        _.map(message.result, function(update){
          let payload = _.extend({device: 'telegram', driver: {}, type: 'message'}, update.message)
          onEvent(payload, sendMessage(update.message.chat.id))
        })

      })
      .catch(console.error);
  }

  setInterval(tick, 1000)
}
