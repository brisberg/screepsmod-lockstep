const {LOCKSTEP_COUNT} = require('../constants');
const {launchScreepsProcess, killScreepsProcess} = require('./helpers');

describe('ScreepsMod Lockstep', () => {
  let serverProc;
  let db, env, pubsub;

  beforeEach(async () => {
    ({serverProc, db, env, pubsub} = await launchScreepsProcess());
  });

  afterEach(async () => {
    killScreepsProcess(serverProc);
  })

  it('server should be paused on startup', async () => {
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });

  it('should progress two ticks when LOCKSTEP_COUNT set to 2', async () => {
    const startTime = await env.get(env.keys.GAMETIME);
    await env.set(LOCKSTEP_COUNT, 2);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(await env.get(env.keys.GAMETIME)).toEqual(startTime + 2);
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });

  it('should post over Pubsub when server becomes locked', async (done) => {
    const startTime = await env.get(env.keys.GAMETIME);
    pubsub.subscribe('lockstep:locked', (gameTime) => {
      expect(gameTime).toEqual(startTime + 2)
      done();
    });
    await env.set(LOCKSTEP_COUNT, 2);
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // expect(pubsub.subscribe).toBe('locked');
  });
});
