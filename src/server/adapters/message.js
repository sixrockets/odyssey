import { sample } from "lodash"
const rp = require("request-promise").defaults({ simple: false, followRedirect: false, resolveWithFullResponse: true})

export default class Message {

  constructor(message, extend) {
    this.originalMessage = message
    this.parsedMessage = message
    this.sample = sample
    this.http = rp
    Object.assign(this, extend)
  }

  hear(regexp, cb){
    const result = regexp.exec(this.parsedMessage.text)
    if (result) cb(result)
  }

  command(commandText, regExp, cb) {
    console.log('on message command')
    const hasRegExp = (cb === void 0)
    const callback = hasRegExp ? regExp : cb
    const regexp = hasRegExp ? /.*/ : regExp
    const commandRegexp = new RegExp(`^[/@#]?${commandText}\\s*(.*)$`, "i")
    let result = commandRegexp.exec(this.parsedMessage.text)
    result = result && regexp.exec(result[1])
    console.log(result)
    if (result) callback(result)
  }

}
