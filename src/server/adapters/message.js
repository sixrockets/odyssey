import { extend, sample, map } from "lodash"
const rp = require("request-promise").defaults({ simple: false, followRedirect: false, resolveWithFullResponse: true})

export default class Message {

  constructor(originalMessage, parsedMessage = {}){
    this.originalMessage = originalMessage
    this.parsedMessage = parsedMessage
    this.extend = extend
    this.sample = sample
    this.map = map
    this.http = rp
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
