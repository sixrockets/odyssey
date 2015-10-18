import { merge } from "lodash"

class KarmaBotParser {

  call(slackMessage) {
    console.log("parsing")
    let action = undefined
    let userName = ""
    const parsedMessage = slackMessage.parsedMessage
    const message = parsedMessage.text.replace("@", "").replace("<", "").replace(">", "")

    // Cutre parse v1
    if ( message.match(/^\w+\+{2}$/) ) {
      action = "karmaPlus"
    } else if ( message.match(/^\w+\-{2}$/) ) {
      action = "karmaMinus"
    } else if ( message.match(/^karmaList$/) ) {
      action = "karmaList"
    }

    if (action !== undefined && action !== "karmaList") {
      userName = message.replace("++", "").replace("--", "")
    }

    console.log("action: " + action)

    console.log( merge(parsedMessage, {action: action, mentionedUserName: userName}) )

    return slackMessage.newFromThis( merge(parsedMessage, {action: action, mentionedUserName: userName}) )
  }
}

module.exports = KarmaBotParser
