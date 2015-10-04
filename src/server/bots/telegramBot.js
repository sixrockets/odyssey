export default class TelegramBot {
  constructor(app) {
    this.app = app
    this.name = "TelegramBot";
  }

  onMessage(msg){
    if(msg.device == 'telegram') {
      msg.hear(/^\/getMe/i, match =>
        msg.driver.command('getMe')().then( res => msg.send(`${res}`) )
      )

      msg.hear(/^\/file (.*)/i, match =>
        msg.driver.command('getFile')({ file_id: match[1] })
          .then( res => msg.send(`${JSON.parse(res).result.file_path}`) )
      )

      msg.hear(/^\/test/i, match =>
        msg.driver.command('sendMessage')({
          chat_id: msg.chat.id,
          text: 'reply_markup',
          disable_web_page_preview: msg.message_id,
          reply_markup: JSON.stringify({
            keyboard: [ ['a a', 'b'], ['c'] ],
            resize_keyboard: false
          })
        })
      )

      msg.hear(/^\/hide/, match =>
        msg.driver.command('sendMessage')({
          chat_id: msg.chat.id,
          text: 'reply_markup',
          disable_web_page_preview: msg.message_id,
          reply_markup: JSON.stringify({
            hide_keyboard: true
          })
        })
      )

      msg.hear(/^\/sticker (.*)/i, match =>
        msg.driver.command('sendSticker')({ chat_id: msg.chat.id, sticker: match[1] })
      )
    }
  }
}
