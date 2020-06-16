module.exports = function(config) {
  if (config.engine) {
    require('./engine')(config);
  }
}
