module.exports = app => {

  const mongoose = app.modules.mongoose

  const Schema = mongoose.Schema

  const userSchema = new Schema({
    slackId: String,
    name: String,
    karma: {type: Number, default: 0}
  })

  userSchema.index({slackId: 1})

  userSchema.methods.setKarma = (value, cb) => {
    this.karma = value
    console.log(this.karma)
    this.save(cb)
  }

  userSchema.methods.increaseKarma = cb => {
    if (this.karma === null || this.karma === undefined) {
      this.karma = 0
    }
    this.setKarma( this.karma + 1, cb )
  }

  userSchema.methods.decreaseKarma = cb => {
    if (this.karma === null || this.karma === undefined) {
      this.karma = 0
    }
    this.setKarma( this.karma - 1, cb )
  }

  // privateGroupSchema.set('autoIndex', false);

  const User = mongoose.model("User", userSchema)

  return User
}
