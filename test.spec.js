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
    await common.storage._connect();
    // await common.storage.resetAllData();
    db = common.storage.db;
    env = common.storage.env;
  });

  afterEach(() => {
    serverProc.kill();
  })

  it('should launch a private server with the mod enabled', async () => {
    const startTime = await env.get(env.keys.GAMETIME);
    await env.set(LOCKSTEP_COUNT, 2);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(await env.get(env.keys.GAMETIME)).toEqual(startTime + 2)
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });
});
