module.exports = app => {
  function SlackUsers(_app) {}

  const User = app.models.User

  const updateOrCreateUser = (member, cb) => {
    const query = User.where({slackId: member.id})
    query.findOne( (err, user) => {
      member.slackId = member.id
      delete member.id
      if (user !== null) {
        User.update({slackId: member.slackId}, member, {upsert: true}, err_ => {
          if (err_) console.log("unable to update user")
          cb()
        })
      } else {
        console.log("the user is null")
        const user_ = new User(member)
        user_.save(err_ => {
          if (err_) console.log("unable to save user")
          cb()
        })
      }
    })
  }

  SlackUsers.prototype.saveUsers = (cb, _key) => {
    console.log("saving users")
    app.modules.async.each(app.slackClient.users, updateOrCreateUser, cb)
  }

  SlackUsers.prototype.userInfo = (id, cb) => {
    User.findOne( {slackId: id}, (err, user) => {
      if (err) cb(err)
      else {
        if (user !== null) cb(null, user)
        else cb(null, null)
      }
    })
  }

  SlackUsers.prototype.findByName = (name, cb) => {
    User.findOne({name: name}, (err, user) => {
      if (err) cb(err)
      else {
        if (user !== null) cb(null, user)
        else cb(null, null)
      }
    })
  }

  SlackUsers.prototype.findByNameOrSlackId = (nameOrSlackId, cb) => {
    User.findOne( { $or: [ {name: nameOrSlackId}, { slackId: nameOrSlackId } ] }, (err, user) => {
      if (err) cb(err)
      else {
        if (user !== null) cb(null, user)
        else cb(null, null)
      }
    })
  }

  SlackUsers.prototype.model = () => User

  return new SlackUsers(app)
}
