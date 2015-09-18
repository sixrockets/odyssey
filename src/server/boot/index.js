"use strict";


module.exports = (app) => {
  require('./modules')(app);
  require('./botPipeline')(app);

}
