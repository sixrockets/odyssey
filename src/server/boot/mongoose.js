module.exports = (app) => {
  console.log('mongoooooose');
  app.models = require('../models/index')(app);
  app.slackUsers = require('../adapters/slackUsers')(app);
  app.modules.mongoose.connect(app.config.mongodb.url);
}
