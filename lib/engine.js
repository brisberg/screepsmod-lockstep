module.exports = (cconfig) => {
  cconfig.engine.on('init', async (processType) => {
    if (processType === 'main') {
      // Modify engine config instance
      const config = cconfig.engine.driver.config;
      const driver = cconfig.engine.driver;
      const env = cconfig.common.storage.env;

      // Start paused
      await env.set(env.keys.LOCKSTEP_COUNT, 0);

      // Chain our custom tick start event
      const oldNotifyTickStarted = driver.notifyTickStarted;
      driver.notifyTickStarted = () => {
        return oldNotifyTickStarted().then(async () => {
          console.log('notifyTickStarted');
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
      config.mainLoopCustomStage = () => {
        return oldCustomStage().then(async () => {
          console.log('customStage');
          const count = await env.get(env.keys.LOCKSTEP_COUNT);

          // Decrement step count
          if (+count) {
            return env.set(env.keys.LOCKSTEP_COUNT, count - 1);
          }
        })
      };
    }
  });
};
