// const launcher = require('@screeps/launcher');
const path = require('path');
const cp = require('child_process');
const common = require('@screeps/common');

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
  it('should launch a private server with the mod enabled', async () => {
    const serverProc = forkServerProcess();

    await new Promise((resolve) => setTimeout(resolve, 4000));

    // const {db} = common.storage;
    // await db['']
    await common.storage._connect(false);
    const gameTime =
        await common.storage.env.get(common.storage.env.keys.GAMETIME);
    console.log(gameTime);

    serverProc.kill();

    expect(true).toBeTruthy();
  });
});
