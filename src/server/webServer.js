import React from "react"
import Router from "react-router"
import routes from "../shared/routes"

const express = require("express")
const expressSession = require("express-session")

module.exports = app => {
  const webServer = express()
  const hbs = require("express-hbs")

  // Use `.hbs` for extensions and find partials in `views/partials`.
  webServer.engine("hbs", hbs.express4({
    partialsDir: __dirname + "/../../views/partials"
  }))
  webServer.set("view engine", "hbs")
  webServer.set("views", __dirname + "/../../views")

  webServer.use(expressSession({ secret: app.config.secret, resave: true, saveUninitialized: true }))

  webServer.get("/", (req, res) => {
    console.log("hello")
    Router.run(routes, req.url, Handler => {
      const content = React.renderToString(<Handler />)
      res.render("index", { content: content })
    })
  })

  webServer.get("/users", (req, res) => {
    app.slackUsers.saveUsers((err, body) => {
      res.send(body)
    })
  })


  webServer.get("/user", (req, res) => {
    app.slackUsers.userInfo(req.query.id, (err, body) => {
      res.send(body)
    })
  })

  webServer.get("/groupsList", (req, res) => {
    const sender = value => res.send(value.body)
    app.slackClient.groupsList().then(sender)
  })

  webServer.get("/channelsList", (req, res) => {
    const sender = value => res.send(value.body)
    app.slackClient.channelsList().then(sender)
  })


  webServer.get("/chatsList", (req, res) => {
    const sender = value => res.send(value)
    app.slackClient.chatsList().then(sender)
  })


  const server = webServer.listen(app.config.port, () => {
    console.log("Listening on port %d", server.address().port)
  })

  return webServer
}
