var _ = require('underscore');

module.exports = function(app){

  var SlackUsers = function(app){
    
  };

  SlackUsers.prototype.saveUsers = function(cb, key){
    app.slackClient.usersList(function(err, response, body){
      if (err)
        cb(err);
      else
        var members={};

        _.each(body['members'], function(member){
          app.redisClient.hset("USER:" + member.id, 'name', member.name);
          app.redisClient.hset("USER:" + member.id, 'real_name', member.real_name);
          members[member.id] = {
            name: member.name,
            real_name: member.real_name
          };
        })

        if(key){
          cb(null, members[key]);
        }else{
          cb(null, members);
        }
    })
  };

  SlackUsers.prototype.userInfo = function(id, cb) {
    app.redisClient.hgetall("USER:" + id, function(err, obj){
      if (err){
        cb(err);
      }else{
        if(obj){
          cb(null, obj);
        }else{
          SlackUsers.prototype.saveUsers(cb, id);
        }
      }
    });
  };

  return new SlackUsers(app);

}
