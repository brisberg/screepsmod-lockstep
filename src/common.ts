import {LOCKSTEP_COUNT, LOCKSTEP_LOCKED, LOCKSTEP_UNLOCK} from './constants';

/** Common component patch (all processes) */
function commonPatch(config: any) {
  const {storage: {env, pubsub}} = config.common

  Object.assign(env.keys, {
    LOCKSTEP_COUNT,
  });

  Object.assign(pubsub.keys, {
    LOCKSTEP_LOCKED,
    LOCKSTEP_UNLOCK,
  });
};

// CommonJS Style Export
export = commonPatch;
