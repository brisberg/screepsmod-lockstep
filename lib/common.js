const {
  LOCKSTEP_COUNT,
  LOCKSTEP_LOCKED,
  LOCKSTEP_UNLOCK,
} = require('../constants');

/** Common component patch (all processes) */
module.exports = (config) => {
  const {storage: {env, pubsub}} = config.common

  Object.assign(env.keys, {
    LOCKSTEP_COUNT,
  });

  Object.assign(pubsub.keys, {
    LOCKSTEP_LOCKED,
    LOCKSTEP_UNLOCK,
  });
};
