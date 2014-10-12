module.exports = function(app){

  var _ = app.modules._;
  var mongoose = app.modules.mongoose;

  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    slackId:  String,
    name: String,
    karma: Number
  });

  userSchema.index({slackId: 1});

  userSchema.methods.setKarma = function(value, cb){
    this.karma = value;
    this.save(err, cb);
  };

  userSchema.methods.increaseKarma = function( cb ){
    this.setKarma( this.karma + 1, cb );

  };

  userSchema.methods.decreaseKarma = function( cb ){
    this.setKarma( this.karma - 1, cb );
  };

  // privateGroupSchema.set('autoIndex', false);

  var User = mongoose.model('User', userSchema);

  return User;
}
