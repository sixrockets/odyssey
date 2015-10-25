const config = require("./config")

const app = {
  config: config()
}

require("./boot/index")(app)

// app.webServer = require('./webServer')(app)

module.exports = app
