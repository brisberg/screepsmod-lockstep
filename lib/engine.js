module.exports = function(cconfig) {
  // Modify engine config instance
  const config = cconfig.engine.driver.config;

  // Chain our custom stage after the existing stage.
  const oldCustomStage = config.mainLoopCustomStage;
  config.mainLoopCustomStage = function() {
    return oldCustomStage().then(() => {
      console.log('lockstep custom stage!');
      return Promise.resolve();
    })
  }
}
