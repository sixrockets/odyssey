var http = require("http")
var ws = require("nodejs-websocket")
var fs = require("fs")

module.exports = function(app, onEvent){
  let fillMessage  = function(message){
    return { device: 'web', driver: {}, type: 'message', text: message }
  }

  http.createServer(function (req, res) {
    fs.createReadStream("index.html").pipe(res)
  }).listen(8000)

  ws.createServer(function (conn) {
      conn.on("text", function (message) {
          onEvent(fillMessage(message), conn.sendText.bind(conn))
      })

      // conn.on("close", function (code, reason) {
      //     console.log("Connection closed")
      // })
  }).listen(8001)

  return true
}
