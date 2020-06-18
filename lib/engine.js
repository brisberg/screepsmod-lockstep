module.exports = (cconfig) => {
  cconfig.engine.on('init', async (processType) => {
    if (processType === 'main') {
      // Modify engine config instance
      const config = cconfig.engine.driver.config;
      const driver = cconfig.engine.driver;
      const env = cconfig.common.storage.env;

      // Start paused
      await env.set(env.keys.MAIN_LOOP_PAUSED, '1');

      // Chain our custom tick start event
      const oldNotifyTickStarted = driver.notifyTickStarted;
      driver.notifyTickStarted = function() {
        return oldNotifyTickStarted().then(async () => {
          const lockstep = await env.get(env.keys.LOCKSTEP_COUNT);
          if (lockstep != undefined && lockstep != null && lockstep <= 0) {
            // Simulate a 'paused' error, special cased in engine/main
            return Promise.reject('Simulation paused');
          }
          return Promise.resolve();
        });
      };

      // Chain our custom stage after the existing stage.
      const oldCustomStage = config.mainLoopCustomStage;
      config.mainLoopCustomStage = function() {
        return oldCustomStage().then(async () => {
          const count = await env.get(env.keys.LOCKSTEP_COUNT);

          // Decrement step count
          if (count) {
            return await env.set(env.keys.LOCKSTEP_COUNT, count - 1);
          }
        })
      };
    }
  });
};
