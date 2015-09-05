"use strict";

var redis = require('redis');

module.exports = function (app) {

  var _ = app.modules._;
  var SlackUsers = function SlackUsers(app) {};

  var User = app.models.User;

  var updateOrCreateUser = function updateOrCreateUser(member, cb) {

    var query = User.where({ slackId: member.id });
    query.findOne(function (err, user) {
      member.slackId = member.id;
      delete member['id'];
      if (user !== null) {
        User.update({ slackId: member.slackId }, member, { upsert: true }, function (err) {
          if (err) console.log('unable to update user');
          cb();
        });
      } else {
        console.log('the user is null');
        user = new User(member);
        user.save(function (err) {
          if (err) console.log('unable to save user');
          cb();
        });
      }
    });
  };

  SlackUsers.prototype.saveUsers = function (cb, key) {
    console.log('saving users');
    app.modules.async.each(app.slackClient.users, updateOrCreateUser, cb);
  };

  SlackUsers.prototype.userInfo = function (id, cb) {
    User.findOne({ slackId: id }, function (err, user) {
      if (err) cb(err);else {
        if (user !== null) cb(null, user);else cb(null, null);
      }
    });
  };

  SlackUsers.prototype.findByName = function (name, cb) {
    User.findOne({ name: name }, function (err, user) {
      if (err) cb(err);else {
        if (user !== null) cb(null, user);else cb(null, null);
      }
    });
  };

  SlackUsers.prototype.findByNameOrSlackId = function (nameOrSlackId, cb) {
    User.findOne({ $or: [{ name: nameOrSlackId }, { slackId: nameOrSlackId }] }, function (err, user) {
      if (err) cb(err);else {
        if (user !== null) cb(null, user);else cb(null, null);
      }
    });
  };

  return new SlackUsers(app);
};