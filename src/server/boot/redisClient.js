module.exports = (app) => {
  app.redisClient = require('../redisClient')(app);
}
