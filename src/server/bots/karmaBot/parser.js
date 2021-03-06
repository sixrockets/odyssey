import { merge } from "lodash"

class KarmaBotParser {

  call(message) {
    let action = undefined
    let userName = ""
    const parsedMessage = message.parsedMessage
    const actionText = parsedMessage.text.replace("@", "").replace("<", "").replace(">", "")

    // Cutre parse v1
    if ( actionText.match(/^\w+\+{2}$/) ) {
      action = "karmaPlus"
    } else if ( actionText.match(/^\w+\-{2}$/) ) {
      action = "karmaMinus"
    } else if ( actionText.match(/^karmaList$/) ) {
      action = "karmaList"
    }

    if (action !== undefined && action !== "karmaList") {
      userName = actionText.replace("++", "").replace("--", "")
    }

    message.parsedMessage = merge(parsedMessage, {action: action, mentionedUserName: userName})
    return message
  }
}

module.exports = KarmaBotParser
