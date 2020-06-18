module.exports = (cconfig) => {
  cconfig.engine.on('init', async (processType) => {
    if (processType === 'main') {
      // Modify engine config instance
      const config = cconfig.engine.driver.config;
      const driver = cconfig.engine.driver;
      const env = cconfig.common.storage.env;

      // Start paused
      await env.set(env.keys.MAIN_LOOP_PAUSED, '1');
      // await env.set(env.keys.LOCKSTEP_COUNT, 0);

      // Chain our custom tick start event
      const oldNotifyTickStarted = driver.notifyTickStarted;
      driver.notifyTickStarted = function() {
        return oldNotifyTickStarted().then(async () => {
          console.log('custom driver notifyTickStarted');
          const lockstep = await env.get(env.keys.LOCKSTEP_COUNT);
          console.log('notifyTickStarted: lockstep_count:', lockstep);
          if (lockstep && lockstep <= 0) {
            console.log('driver notifyTickStarted locked!');
            return Promise.reject('Simulation paused');
          }
          return Promise.resolve();
        });
      };

      // Chain our custom stage after the existing stage.
      const oldCustomStage = config.mainLoopCustomStage;
      config.mainLoopCustomStage = function() {
        return oldCustomStage().then(async () => {
          console.log('lockstep custom stage!');
          const count = await env.get(env.keys.LOCKSTEP_COUNT);
          console.log('mainLoopCustomStage: lockstep_count', count);

          // Decrement step count
          if (count) {
            return env.set(env.keys.LOCKSTEP_COUNT, count - 1);
          }
        })
      };
    }
  });
};
