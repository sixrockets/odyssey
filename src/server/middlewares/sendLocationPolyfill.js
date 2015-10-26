export default function sendLocationPolyfill(msg) {
  if (!msg.sendLocation) {
    msg.sendLocation = ({lat, lon}) =>
      msg.send(`https://www.google.com/maps/search/${lat},${lon}`)
  }
  return msg
}
