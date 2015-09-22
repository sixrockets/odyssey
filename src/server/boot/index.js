"use strict";

module.exports = (app) => {
  require('./modules')(app);
  require('./slackClient')(app);
  require('./redisClient')(app);
  require('./mongoose')(app);
  require('./botPipeline')(app);
}
