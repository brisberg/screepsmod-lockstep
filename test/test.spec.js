const {LOCKSTEP_COUNT} = require('../constants');
const {launchScreepsProcess} = require('./helpers');

describe('ScreepsMod Lockstep', () => {
  let serverProc;
  let db, env;

  beforeEach(async () => {
    ({serverProc, db, env} = await launchScreepsProcess());
  });

  afterEach(async () => {
    serverProc.kill();
  })

  it.only('server should be paused on startup', async () => {
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });

  it('should progress two ticks when LOCKSTEP_COUNT set to 2', async () => {
    const startTime = await env.get(env.keys.GAMETIME);
    await env.set(LOCKSTEP_COUNT, 2);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(await env.get(env.keys.GAMETIME)).toEqual(startTime + 2);
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });

  it('should post over Pubsub when server becomes locked', async () => {
    await env.set(LOCKSTEP_COUNT, 2);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // expect(pubsub.subscribe).toBe('locked');
  });
});
