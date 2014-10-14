var _ = require('underscore');

module.exports = function(app){

  var SlackUsers = function(app){

  };

  var User = app.models.User;

  var updateOrCreateUser = function(member, cb){
    console.log('updating or creating user ' + member.id);
    console.log(member);
    var query = User.where({slackId: member.id})
    query.findOne( function(err, user){
      member.slackId = member.id;
      delete member['id'];
      console.log(user);
      if (user !== null){
        User.update({slackId: member.slackId}, member  , {upsert: true}, function(err){
          if (err) console.log('unable to update location');
          cb();
        });
      } else {
        console.log('the user is null');
        user = new User(member);
        user.save(function(err){
          if (err) console.log('unable to save location');
          cb();
        });
      }
    });
  };

  SlackUsers.prototype.saveUsers = function(cb, key){
    app.slackClient.usersList(function(err, response, body){
      console.log('got list of users');
      if (err) cb(err);
      else app.modules.async.each(body['members'], updateOrCreateUser, cb);
    })
  };

  SlackUsers.prototype.userInfo = function(id, cb) {
    console.log('getting userInfo from ' + id);
    User.findOne( {slackId: id}, function(err, user){
      if(err) cb(err)
      else {
        if (user !== null) cb(null, user)
        else cb(null, null)
      }
    });
  };

  SlackUsers.prototype.findByName = function(name, cb){
    User.findOne({name: name}, function(err, user){
      if(err) cb(err)
      else{
        if (user !== null) cb(null, user)
        else cb(null, null)
      }
    });
  };

  return new SlackUsers(app);
}
