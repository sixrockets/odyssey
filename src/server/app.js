import config from "./config"

export const app = { config: config() }

require("./boot/index")(app)

// app.webServer = require('./webServer')(app)
