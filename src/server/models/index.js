module.exports = app => {
  return {
    PrivateGroup: require("./privateGroup")(app),
    User: require("./user")(app)
  }
}
