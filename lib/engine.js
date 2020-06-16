module.exports = function(cconfig) {
  cconfig.engine.on('init', async function(processType) {
    if (processType === 'main') {
      // Modify engine config instance
      const config = cconfig.engine.driver.config;
      const env = cconfig.common.storage.env;

      await env.set(env.keys.LOCKSTEP_COUNT, 5);

      // Chain our custom stage after the existing stage.
      const oldCustomStage = config.mainLoopCustomStage;
      config.mainLoopCustomStage = function() {
        return oldCustomStage().then(async () => {
          console.log('lockstep custom stage!');
          const count = await env.get(env.keys.LOCKSTEP_COUNT) || 0;
          console.log(count);

          if (count === 0) {
            console.log('pausing');
            return env.set(env.keys.MAIN_LOOP_PAUSED, '1');
          } else {
            return env.set(env.keys.LOCKSTEP_COUNT, count - 1);
          }
        })
      };
    }
  });
};
