/** Engine component patch */
module.exports = (cconfig) => {
  cconfig.engine.on('init', async (processType) => {
    if (processType === 'main') {
      // Modify engine config instance
      const config = cconfig.engine.driver.config;
      const driver = cconfig.engine.driver;
      const {env, pubsub} = cconfig.common.storage;

      // Start paused
      await env.set(env.keys.LOCKSTEP_COUNT, 0);

      // Subscribe to requests for tick
      pubsub.subscribe('lockstep:unlock', async (ticks) => {
        await env.set(env.keys.LOCKSTEP_COUNT, ticks);
      });

      // Chain our custom tick start event
      const oldNotifyTickStarted = driver.notifyTickStarted;
      driver.notifyTickStarted = () => {
        return oldNotifyTickStarted().then(async () => {
          // console.log('lockstep:notifyTickStarted');
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
          // console.log('lockstep:customStage');
          const gameTime = await env.get(env.keys.GAMETIME);
          let count = await env.get(env.keys.LOCKSTEP_COUNT);

          // Decrement step count
          if (+count) {
            count--;
            if (count === 0) {
              pubsub.publish('lockstep:locked', gameTime);
            }
            return env.set(env.keys.LOCKSTEP_COUNT, count);
          }
        })
      };
    }
  });
};
