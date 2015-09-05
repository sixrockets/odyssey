'use strict';

module.exports = function (app) {

  var _ = app.modules._;
  var mongoose = app.modules.mongoose;

  var Schema = mongoose.Schema;

  var privateGroupSchema = new Schema({
    slackId: String,
    nombre: String,
    created: { type: Date, 'default': Date.now },
    creator: String,
    members: [String]
  });

  privateGroupSchema.index({ slackId: 1 });

  // privateGroupSchema.set('autoIndex', false);

  var PrivateGroup = mongoose.model('PrivateGroup', privateGroupSchema);

  return PrivateGroup;
};