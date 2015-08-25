"use strict";

let redis = require('redis');

module.exports = function(app){

  let _ = app.modules._;
  let SlackUsers = function(app){

  };

  let User = app.models.User;

  let updateOrCreateUser = function(member, cb){

    let query = User.where({slackId: member.id});
    query.findOne( function(err, user){
      member.slackId = member.id;
      delete member['id'];
      if (user !== null){
        User.update({slackId: member.slackId}, member  , {upsert: true}, function(err){
          if (err) console.log('unable to update user');
          cb();
        });
      } else {
        console.log('the user is null');
        user = new User(member);
        user.save(function(err){
          if (err) console.log('unable to save user');
          cb();
        });
      }
    });
  };

  SlackUsers.prototype.saveUsers = function(cb, key){
    console.log('saving users');
    app.redisClient.exists("tryRedis", redis.print);
    console.log('saving users');
    app.modules.async.each(app.slackClient.users, updateOrCreateUser, cb);
  };

  SlackUsers.prototype.userInfo = function(id, cb) {
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

  SlackUsers.prototype.findByNameOrSlackId = function(nameOrSlackId, cb){
    User.findOne( { $or: [ {name: nameOrSlackId}, { slackId: nameOrSlackId } ] } , function(err, user){
      if(err) cb(err)
      else{
        if (user !== null) cb(null, user)
        else cb(null, null)
      }
    });
  };

  return new SlackUsers(app);
}
