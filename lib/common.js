module.exports = (config) => {
  const {storage: {env}} = config.common

  Object.assign(env.keys, {
    LOCKSTEP_COUNT: 'lockstepCount',
  });
};
