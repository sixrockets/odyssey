const redis = require("redis")
module.exports = app => {
  const redisConf = app.config.redis
  const redisClient = redis.createClient(redisConf.port, redisConf.host, redisConf.options)
  if (process.env.NODE_ENV === "production") {
    redisClient.auth(app.config.redis.pwd, () => {
      console.log("redis OK")
    })
  }

  redisClient.on("error", err => {
    console.log("RedisError: " + err)
  })

  redisClient.on("ready", _err => {
    console.log("Redis is ready to GO")
    redisClient.exists("tryRedis", redis.print)
  })

  return redisClient
}
