module.exports = function(config) {
  // Common patch (for all modules)
  require('./common')(config);

  // Engine patch
  if (config.engine) {
    require('./engine')(config);
  }
};
