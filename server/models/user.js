module.exports = function(app){

  var _ = app.modules._;
  var mongoose = app.modules.mongoose;

  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    slackId:  String,
    name: String,
    karma: {type: Number, default: 0}
  });

  userSchema.index({slackId: 1});

  userSchema.methods.setKarma = function(value, cb){
    this.karma = value;
    console.log(this.karma);
    this.save(cb);
  };

  userSchema.methods.increaseKarma = function( cb ){
    if (this.karma === null || this.karma === undefined){
      this.karma = 0;
    }
    this.setKarma( this.karma + 1, cb );
  };

  userSchema.methods.decreaseKarma = function( cb ){
    if (this.karma === null || this.karma === undefined){
      this.karma = 0;
    }
    this.setKarma( this.karma - 1, cb );
  };

  // privateGroupSchema.set('autoIndex', false);

  var User = mongoose.model('User', userSchema);

  return User;
}
