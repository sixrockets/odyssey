import http from "http"
import ws from "nodejs-websocket"
import fs from "fs"
import Message from "./message"
import EventEmitter from "events"

export default app => {
  const driver = new EventEmitter()
  const device = "web"
  const type = "message"

  const emit = (text, send) =>
    driver.emit("event", new Message({type, text}, {device, driver, send}))

  http.createServer((req, res) => {
    fs.createReadStream("index.html").pipe(res)
  }).listen(8000)

  ws.createServer(conn => {
    conn.on("text", text => emit(text, conn.sendText.bind(conn)))

    // conn.on("close", (code, reason) => {
    //     console.log("Connection closed")
    // })
  }).listen(8001)

  return driver
}
