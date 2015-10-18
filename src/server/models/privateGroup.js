module.exports = app => {
  const mongoose = app.modules.mongoose

  const Schema = mongoose.Schema

  const privateGroupSchema = new Schema({
    slackId: String,
    nombre: String,
    created: { type: Date, default: Date.now },
    creator: String,
    members: [String]
  })

  privateGroupSchema.index({slackId: 1})

  // privateGroupSchema.set('autoIndex', false);

  const PrivateGroup = mongoose.model("PrivateGroup", privateGroupSchema)

  return PrivateGroup
}
