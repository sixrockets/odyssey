const http = require("http")
const ws = require("nodejs-websocket")
const fs = require("fs")

module.exports = (app, onEvent) => {
  const fillMessage = message => {
    return { device: "web", driver: {}, type: "message", text: message }
  }

  http.createServer((req, res) => {
    fs.createReadStream("index.html").pipe(res)
  }).listen(8000)

  ws.createServer(conn => {
    conn.on("text", message => {
      onEvent(fillMessage(message), conn.sendText.bind(conn))
    })

    // conn.on("close", (code, reason) => {
    //     console.log("Connection closed")
    // })
  }).listen(8001)

  return true
}
