module.exports = function(app){
  return {
    PrivateGroup: require('./privateGroup')(app)
  }
}
