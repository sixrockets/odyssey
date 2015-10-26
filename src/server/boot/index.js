import bots from "./bots"
import adapters from "./adapters"
import middlewares from "./middlewares"
import listener from "./listener"
import modules from "./modules"
import redisClient from "./redisClient"
import mongoose from "./mongoose"

module.exports = (app) => {
  modules(app)
  redisClient(app)
  mongoose(app)
  app.bots = bots(app)
  app.middlewares = middlewares(app)
  app.listener = listener(app)

  app.adapters = adapters(app)
  app.adapters.forEach(adapter => adapter.on("event", app.listener))
}
