import { contains } from "lodash"
import { ninvoke } from "Q"
const MessageParser = require("./karmaBot/parser")

module.exports = (app) => {

  class KarmaBot {

    constructor() {
      this.name = "karmaBot"
      this.slackUsers = app.slackUsers
      this.slackClient = app.slackClient
      this.redisClient = app.redisClient
      this.messageParser = new MessageParser()
      this.globalCommands = ["karmaList"]
      this.userCommands = ["karmaPlus", "karmaMinus"]
      this.allCommands = this.globalCommands + this.userCommands
    }

    increaseKarma(userName, performerId, cb) {
      console.log("increasing karma for " + userName)
      this.redisClient.set("karmaBot:karmaPlus" + userName, "1", "NX", "EX", 5)
      this.slackUsers.findByNameOrSlackId(userName, (err, user) => {
        if ( user !== null && user.slackId !== performerId ) {
          user.increaseKarma(cb)
        }
      })
    }

    decreaseKarma(userName, performerId, cb) {
      console.log("decreasing karma for " + userName)
      this.redisClient.set("karmaBot:karmaMinus" + userName, "1", "NX", "EX", 5)
      this.slackUsers.findByNameOrSlackId(userName, (err, user) => {
        if ( user !== null && user.slackId !== performerId ) {
          user.decreaseKarma(cb)
        }
      })
    }

    showKarma( message, _cb ) {
      console.log("show karma called")
      this.redisClient.set("karmaBot:karmaList", "1", "NX", "EX", 10)
      const query = this.slackUsers.model().find().sort( [["karma", "descending"]] ).limit(5)
      query.exec((err, users) => {
        let index = 1
        const messages = users.map(user => {
          let str = ""
          let karma = 0
          karma = (user.karma === undefined) ? 0 : user.karma
          str = index + " " + user.name + user.name[user.name.length - 1] + ": " + karma
          index++
          return str
        })

        message.send(messages.join("\n"))
      })
    }

    canPerformAction(userAction) {
      let actionKey = "karmaBot:"
      if ( contains( this.globalCommands, userAction.action) ) { actionKey += userAction.action }
      else actionKey += userAction.action + ":" + userAction.userName
      return ninvoke(this.redisClient, "exists", actionKey)
    }


    _tryAction(message, cb) {

      const parsedInfo = this.messageParser["call"](message).parsedMessage
      const action = parsedInfo.action
      if (action !== undefined ) {
        console.log("action OK")
        this.canPerformAction(parsedInfo)
          .done( notCanPerform => {
            if ( notCanPerform === "0") {
              switch (action) {
                case "karmaPlus":
                  this.increaseKarma( parsedInfo.mentionedUserName, parsedInfo.userId, cb )
                  break
                case "karmaMinus":
                  this.decreaseKarma( parsedInfo.mentionedUserName, parsedInfo.userId, cb )
                  break
                case "karmaList":
                  this.showKarma( message, cb )
                  break
                default:
                  break
              }
            }
          })
          .fail( (error) => { console.log(error) } )
      }
    }

    onMessage(message) {
      this._tryAction(message, () => console.log("try action callback"))
    }
  }

  return KarmaBot
}
