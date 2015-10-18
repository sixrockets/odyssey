module.exports = (app) => {
  require("./modules")(app)
  require("./redisClient")(app)
  require("./mongoose")(app)
  require("./bots")(app)
  require("./adapters")(app)
}
