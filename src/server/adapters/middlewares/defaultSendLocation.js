import {partial} from "lodash"

class DefaultSendLocation {
  call(adapter, message) {
    message.sendLocation = (location) => {
      message.send(`https://www.google.com/maps/search/${location.lat},${location.lon}`)
    }.bind(message)
    return message
  }
}

module.exports = new DefaultSendLocation()
