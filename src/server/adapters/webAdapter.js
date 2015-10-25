const http = require("http")
const ws = require("nodejs-websocket")
const fs = require("fs")

import Message from "./message"
import EventEmitter from "events"

export default app => {
  const emitter = new EventEmitter()

  const emit = (text, send) => {
    const message = new Message(null, {type: 'message', text})
    Object.assign(message, {device: "web", driver: {}, send})
    emitter.emit('event', message)
  }

  http.createServer((req, res) => {
    fs.createReadStream("index.html").pipe(res)
  }).listen(8000)

  ws.createServer(conn => {
    conn.on("text", text => emit(text, ::conn.sendText))

    // conn.on("close", (code, reason) => {
    //     console.log("Connection closed")
    // })
  }).listen(8001)

  return emitter
}
