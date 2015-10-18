const path = require('path');
const config = require('./config');

const serverPath = route => path.join(__dirname, route);

const app = {};

app.config = config();
require('./boot/index')(app);

app.serverPath = serverPath;

// app.webServer = require('./webServer')(app)

module.exports = app;
