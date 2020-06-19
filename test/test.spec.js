const {LOCKSTEP_COUNT} = require('../constants');
const {launchScreepsProcess, killScreepsProcess} = require('./helpers');

describe('ScreepsMod Lockstep', () => {
  let serverProc;
  let db, env;

  beforeEach(async () => {
    ({serverProc, db, env} = await launchScreepsProcess());
  });

  afterEach(async () => {
    killScreepsProcess(serverProc);
  })

  it('should launch a private server with the mod enabled', async () => {
    const startTime = await env.get(env.keys.GAMETIME);
    await env.set(LOCKSTEP_COUNT, 2);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(await env.get(env.keys.GAMETIME)).toEqual(startTime + 2)
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });
});
