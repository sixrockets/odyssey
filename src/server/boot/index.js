module.exports = (app) => {
  require("./modules")(app)
  require("./redisClient")(app)
  require("./mongoose")(app)
  app.bots = require("./bots")(app)
  app.adapters = require("./adapters")(app)
  require("./listeners")(app)
}
