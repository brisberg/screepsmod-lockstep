const path = require('path');
const cp = require('child_process');
const common = require('@screeps/common');
const {LOCKSTEP_COUNT} = require('./constants');

process.env.STORAGE_PORT = '24567';
// process.env.STORAGE_HOST = 'localhost';

// Forks a full Screeps Server process and returns the handle
function forkServerProcess() {
  const execPath = path.resolve(
      path.dirname(require.resolve('@screeps/launcher')),
      '../bin/screeps.js',
  );
  return cp.fork(
      path.resolve(execPath),
      ['start', '--steam_api_key', process.env.STEAM_API_KEY],
      {cwd: path.join(__dirname, './testEnv'), stdio: 'inherit'},
  );
}

describe('ScreepsMod Lockstep', () => {
  let serverProc;
  let db, env;

  beforeEach(async () => {
    serverProc = forkServerProcess();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // await setTimeout(() => {}, 100);
    await common.storage._connect();
    // await common.storage.resetAllData();
    db = common.storage.db;
    env = common.storage.env;
    await env.set(env.keys.MAIN_LOOP_PAUSED, '0');
  });

  afterEach(() => {
    serverProc.kill();
  })

  it('should launch a private server with the mod enabled', async () => {
    // Pause
    // await env.set(env.keys.MAIN_LOOP_PAUSED, '1');

    const gameTime1 = await env.get(env.keys.GAMETIME);
    // await env.set(LOCKSTEP_COUNT, 2);
    // await env.set(env.keys.MAIN_LOOP_PAUSED, '0');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const gameTime2 = await env.get(env.keys.GAMETIME);
    expect(gameTime2).toEqual(gameTime1 + 3)
    const key = env.keys.LOCKSTEP_COUNT;
    console.log('key: ', key);
    const lockstep = await env.get(LOCKSTEP_COUNT);
    expect(lockstep).toEqual(undefined);
  });
});
